import handler from "../handler.ts";
import { buildServiceWorker } from "./build.ts";
import { generateCron, generateRoutes } from "./gen.ts";
import init from "@http/fns/hosting/init_localhost";
import initCron from "../cron.ts";
import generateQuote from "../routes/quote/_cron/generate_quote.ts";

await generateRoutes();
await generateCron();

await buildServiceWorker();

await generateQuote();

await initCron();

await Deno.serve(await init(handler)).finished;
