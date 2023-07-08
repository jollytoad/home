import { byPattern } from "$http_fns/pattern.ts";
import { handle } from "$http_fns/handle.ts";

Deno.serve(handle([
  byPattern("/hello", () => {
    return new Response("Hello world");
  }),
  byPattern("/:path*", (_req, match) => {
    return new Response(`You are ${match.pathname.groups.path}`);
  }),
]));
