import { serve } from "$ahx_fns/http/server.ts";
import handler from "@/handler.ts";
import init from "@/init.ts";
import { setDeferredTimeout } from "$jsx/config.ts";

setDeferredTimeout(10);

await serve(handler, init);
