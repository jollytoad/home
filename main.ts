import handler from "./handler.ts";
import init from "@http/host-deno-deploy/init";
import initCron from "./cron.ts";

await initCron();

await Deno.serve(await init(handler)).finished;
