import { load } from "$std/dotenv/mod.ts";
import { serve } from "$ahx_fns/http/dev_server.ts";
import handler from "@/handler.ts";
import init from "@/init.ts";
import { delayStream } from "$http_render_fns/render_html.tsx";

await load({ export: true });

delayStream(1);

await serve(handler, init);
