// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import * as cron_1 from "./routes/quote/_cron/generate_quote.ts";
import * as cron_2 from "./routes/quiz/_cron/delete_old_scores.ts";

export default function initCron() {
  Deno.cron(cron_1.name, cron_1.schedule, cron_1.default);
  Deno.cron(cron_2.name, cron_2.schedule, cron_2.default);
}
