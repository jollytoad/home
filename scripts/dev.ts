import handler from "../handler.ts";
import { buildServiceWorker } from "./build.ts";
import generateRoutes from "./gen.ts";
import init from "@http/fns/hosting/init_localhost";

await generateRoutes();

await buildServiceWorker();

await Deno.serve(await init(handler)).finished;
