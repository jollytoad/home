// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import * as cron_1 from "./routes/quote/_cron/generate_quote.ts";

export default function () {
  Deno.cron(cron_1.name, cron_1.schedule, cron_1.default);
}
