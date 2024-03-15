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

export function getQuoteConfig(): QuoteConfig {
  if (!_config) {
    _config = {
      schedule: Deno.env.get("QUOTE_SCHEDULE") ?? "*/5 * * * *",
      refresh: parseInt(Deno.env.get("QUOTE_TV_REFRESH") ?? "") || (6 * 60),
      model: Deno.env.get("QUOTE_AI_MODEL") ?? "gpt-3.5-turbo",
      temperature: parseFloat(Deno.env.get("QUOTE_AI_TEMPERATURE") ?? "") ||
        1.5,
      prompt: Deno.env.get("QUOTE_AI_PROMPT") ??
        "Generate a new obscure inspirational quote of the day. Do not attribute it to anyone.",
    };
  }
  return _config;
}
