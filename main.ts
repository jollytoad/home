import handler from "./handler.ts";
import init from "@http/fns/hosting/init_deploy";
import initCron from "./cron.ts";

await initCron();

await Deno.serve(await init(handler)).finished;
