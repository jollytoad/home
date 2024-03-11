import handler from "./handler.ts";
import init from "@http/fns/hosting/init_deploy";

await Deno.serve(await init(handler)).finished;
