import { handle } from "$http_fns/handle.ts";
import { byPattern } from "$http_fns/pattern.ts";
import { byMethod } from "$http_fns/method.ts";
import { byMediaType } from "$http_fns/media_type.ts";

Deno.serve(handle([
  byPattern(
    "/hello{.:ext}?",
    byMethod({
      GET: byMediaType({
        "text/plain": () => {
          return new Response("Hello world");
        },
        "text/html": () => {
          return new Response(
            "<html><body><h1>Hello world</h1></body></html>",
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        },
      }),
    }),
  ),
]));
