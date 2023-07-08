import { handle } from "$http_fns/handle.ts";
import { byPattern } from "$http_fns/pattern.ts";
import { byMethod } from "$http_fns/method.ts";

Deno.serve(handle([
  byPattern(
    "/hello",
    byMethod({
      GET: () => {
        return new Response("Hello world");
      },
    }),
  ),
  byPattern(
    "/:path*",
    byMethod({
      GET: (_req, match) => {
        return new Response(`GET from ${match.pathname.groups.path}`);
      },
      PUT: (_req, match) => {
        return new Response(`PUT to ${match.pathname.groups.path}`);
      },
    }),
  ),
]));
