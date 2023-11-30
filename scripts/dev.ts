import handler from "@/handler.ts";
import { buildServiceWorker } from "./build.ts";
import generateRoutes from "./gen.ts";
import init from "$http_fns/hosting/init_localhost.ts";

await generateRoutes();

await buildServiceWorker();

await Deno.serve(await init(handler)).finished;
