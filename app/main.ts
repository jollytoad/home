import handler from "./handler.ts";
import cache from "./cache.ts";
import init from "@http/host-deno-deploy/init";
import { cascade } from "@http/route/cascade";
import initCron from "./cron.ts";

await initCron();

await Deno.serve(await init(cascade(cache, handler))).finished;
