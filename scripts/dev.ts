#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env --env --allow-sys --allow-run --allow-write --allow-hrtime --allow-ffi --watch

import { buildServiceWorker } from "./build.ts";
import { generateCron, generateRoutes } from "./gen.ts";
import init from "@http/host-deno-local/init";
import initCron from "../app/cron.ts";
import generateQuote from "../app/routes/quote/_cron/generate_quote.ts";
import { lazy } from "@http/route/lazy";

await generateRoutes();
await generateCron();

await buildServiceWorker();

await generateQuote();

await initCron();

const handler = lazy(import.meta.resolve("../app/handler.ts"));

await Deno.serve(await init(handler)).finished;
