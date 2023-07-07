import { handle } from "$http_fns/handle.ts";
import { staticRoute } from "$http_fns/static.ts";
import { byPattern } from "$http_fns/pattern.ts";
import { interceptResponse, skip } from "$http_fns/intercept.ts";
import routes from "@/routes.ts";
import oauth2 from "@/handlers/oauth2.ts";
import { lazy } from "$http_fns/lazy.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("@/cache")),
    skip(404),
  ),
  oauth2,
  byPattern(
    "/blog/:path*{.:ext}",
    lazy(() => import("@/routes/blog/:path*.tsx")),
  ),
  routes,
  staticRoute("/", import.meta.resolve("@/static")),
]);
