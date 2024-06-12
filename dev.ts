#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env --env --allow-sys --allow-run --allow-write --allow-hrtime --allow-ffi --watch

import { buildServiceWorker } from "./scripts/build.ts";
import { generateCron, generateRoutes } from "./scripts/gen.ts";
import init from "@http/host-deno-local/init";
import initCron from "./cron.ts";
import generateQuote from "./routes/quote/_cron/generate_quote.ts";
import { lazy } from "@http/route/lazy";

await generateRoutes();
await generateCron();

await buildServiceWorker();

await generateQuote();

await initCron();

const handler = lazy(import.meta.resolve("./handler.ts"));

await Deno.serve(await init(handler)).finished;
