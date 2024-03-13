import * as quote_cron from "./routes/quote/_cron/generate_quote.ts";

// TODO: discover all _cron modules and generate this function

export default function initCron() {
  Deno.cron(quote_cron.name, quote_cron.schedule, quote_cron.default);
}
