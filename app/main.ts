#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env --env

import handler from "./handler.ts";
import cache from "./cache.ts";
import init from "@http/host-deno-deploy/init";
import { cascade } from "@http/route/cascade";
import initCron from "./cron.ts";
import { setStore } from "@jollytoad/store";

setStore(import("@jollytoad/store-deno-kv"));

await initCron();

await Deno.serve(await init(cascade(cache, handler))).finished;
