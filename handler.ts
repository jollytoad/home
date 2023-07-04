import { handle } from "$http_fns/handle.ts";
import { staticRoute } from "$http_fns/static.ts";
import { byPattern } from "$http_fns/pattern.ts";
import { interceptResponse, skip } from "$http_fns/intercept.ts";
import routes from "@/routes.ts";
import blogRoute from "@/routes/blog/:path*.tsx";
import oauth2 from "@/handlers/oauth2.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("@/cache")),
    skip(404),
  ),
  oauth2,
  byPattern("/blog/:path*{.:ext}", blogRoute),
  routes,
  staticRoute("/", import.meta.resolve("@/static")),
]);
