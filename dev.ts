import { load } from "$std/dotenv/mod.ts";
import { serve } from "$ahx_fns/http/dev_server.ts";
import handler from "@/handler.ts";
import init from "@/init.ts";
import { buildServiceWorker } from "@/build.ts";

await load({ export: true });

await buildServiceWorker();

await serve(handler, init);
