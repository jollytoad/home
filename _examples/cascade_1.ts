import { byPattern } from "$http_fns/pattern.ts";
import { withFallback } from "$http_fns/fallback.ts";
import { cascade } from "$http_fns/cascade.ts";

Deno.serve(withFallback(
  cascade(
    byPattern("/hello", () => {
      return new Response("Hello world");
    }),
    byPattern("/:path*", (_req, match) => {
      return new Response(`You are ${match.pathname.groups.path}`);
    }),
  ),
));
