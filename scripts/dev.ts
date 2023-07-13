import { load } from "$std/dotenv/mod.ts";
import handler from "@/handler.ts";
import { buildServiceWorker } from "./build.ts";
import generateRoutes from "./gen.ts";
import init from "$http_fns/hosting/localhost.ts";

await load({ export: true });

await generateRoutes();

await buildServiceWorker();

await Deno.serve(await init(handler)).finished;
