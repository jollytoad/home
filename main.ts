import { serve } from "$ahx_fns/http/server.ts";
import handler from "@/handler.ts";
import init from "@/init.ts";

await serve(handler, init);
