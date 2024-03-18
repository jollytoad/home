export interface QuizConfig {
  /**
   * Cron schedule
   */
  schedule: string;

  /**
   * Maximum age of a quiz score before it's expired (in milliseconds)
   */
  scoreExpiryAge: number;
}

let _config: QuizConfig | undefined;

const DEFAULT_SCORE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export function getQuizConfig(): QuizConfig {
  if (!_config) {
    _config = {
      schedule: Deno.env.get("QUIZ_SCHEDULE") ?? "33 3 * * *",
      scoreExpiryAge: parseDuration(Deno.env.get("QUIZ_SCORE_EXPIRY") ?? "") ||
        DEFAULT_SCORE_EXPIRY,
    };
  }
  return _config;
}

function parseDuration(duration: string) {
  if (duration.startsWith("P") && "Temporal" in globalThis) {
    try {
      return Temporal.Duration.from(duration).total("milliseconds");
    } catch {
      return NaN;
    }
  } else {
    return parseInt(duration);
  }
}
