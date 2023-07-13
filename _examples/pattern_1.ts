import { byPattern } from "$http_fns/pattern.ts";
import { withFallback } from "$http_fns/fallback.ts";

Deno.serve(withFallback(
  byPattern("/:path*", (_req, match) => {
    return new Response(`You are at ${match.pathname.groups.path}`);
  }),
));
