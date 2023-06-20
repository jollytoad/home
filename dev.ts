import { load } from "$std/dotenv/mod.ts";
import { serve } from "$ahx_fns/http/dev_server.ts";
import handler from "@/handler.ts";
import init from "@/init.ts";
import { setDeferredTimeout, setStreamDelay } from "$jsx/config.ts";

await load({ export: true });

setStreamDelay(1);
setDeferredTimeout(100);

await serve(handler, init);
