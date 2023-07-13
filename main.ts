import handler from "@/handler.ts";
import init from "$http_fns/hosting/deploy.ts";

await Deno.serve(await init(handler)).finished;
