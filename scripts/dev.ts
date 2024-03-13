import handler from "../handler.ts";
import { buildServiceWorker } from "./build.ts";
import generateRoutes from "./gen.ts";
import init from "@http/fns/hosting/init_localhost";
import initCron from "../cron.ts";
import generateQuote from "../routes/quote/_cron/generate_quote.ts";

await generateRoutes();

await buildServiceWorker();

await generateQuote();

await initCron();

await Deno.serve(await init(handler)).finished;
