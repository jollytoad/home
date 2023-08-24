import { handle } from "$http_fns/handle.ts";
import { staticRoute } from "$http_fns/static.ts";
import { interceptResponse, skip } from "$http_fns/intercept.ts";
import routes from "@/routes.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("@/cache")),
    skip(404, 405),
  ),
  routes,
  staticRoute("/", import.meta.resolve("@/static")),
]);
