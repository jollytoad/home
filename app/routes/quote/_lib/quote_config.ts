import { getEnv } from "../../../lib/env.ts";

export interface QuoteConfig {
  /**
   * Cron schedule for generating a new quote
   */
  schedule: string;

  /**
   * TV mode refresh period (in seconds)
   */
  refresh: number;

  /**
   * OpenAI model for quote generation
   */
  model: string;

  /**
   * OpenAI model temperature
   */
  temperature: number;

  /**
   * Prompt for OpenAI quote generation
   */
  prompt: string;
}

let _config: QuoteConfig | undefined;

export function getQuoteConfig(req?: Request): QuoteConfig {
  if (!_config) {
    _config = {
      schedule: getEnv("QUOTE_SCHEDULE", req) ?? "*/5 * * * *",
      refresh: parseInt(getEnv("QUOTE_TV_REFRESH", req) ?? "") || (6 * 60),
      model: getEnv("QUOTE_AI_MODEL", req) ?? "gpt-3.5-turbo",
      temperature: parseFloat(getEnv("QUOTE_AI_TEMPERATURE", req) ?? "") ||
        1.5,
      prompt: getEnv("QUOTE_AI_PROMPT", req) ??
        "Generate a new obscure inspirational quote of the day. Do not attribute it to anyone.",
    };
  }
  return _config;
}
