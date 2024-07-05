#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env --env --allow-sys --allow-run --allow-write --allow-hrtime --allow-ffi --watch

import { buildServiceWorker } from "./build.ts";
import { generateCron, generateRoutes } from "./gen.ts";
import init from "@http/host-deno-local/init";
import initCron from "../app/cron.ts";
import generateQuote from "../app/routes/quote/_cron/generate_quote.ts";
import { lazy } from "@http/route/lazy";
import { getEnv, hasEnv, setEnv } from "@cross/env";
import { cascade } from "@http/route/cascade";
import type { RequestHandler } from "@http/route/types";
import { setStore } from "@jollytoad/store";

if (!hasEnv("AUTO_REFRESH")) {
  setEnv("AUTO_REFRESH", "true");
}

if (!hasEnv("STORAGE_MODULE")) {
  setStore(import("@jollytoad/store-deno-fs"));
}

await generateRoutes();
await generateCron();

await buildServiceWorker();

console.log("Storage module:", await (await import("@jollytoad/store")).url());

await generateQuote();

await initCron();

let cache: RequestHandler = () => null;

if (getEnv("USE_CACHE") === "true") {
  console.log("Using cache");
  cache = lazy(import.meta.resolve("../app/cache.ts"));
}

const handler = lazy(import.meta.resolve("../app/handler.ts"));

await Deno.serve(await init(cascade(cache, handler))).finished;
