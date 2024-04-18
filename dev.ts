import handler from "./handler.ts";
import { buildServiceWorker } from "./scripts/build.ts";
import { generateCron, generateRoutes } from "./scripts/gen.ts";
import init from "@http/host-deno-local/init";
import initCron from "./cron.ts";
import generateQuote from "./routes/quote/_cron/generate_quote.ts";

await generateRoutes();
await generateCron();

await buildServiceWorker();

await generateQuote();

await initCron();

await Deno.serve(await init(handler)).finished;
