import { handle } from "@http/route/handle";
import { staticRoute } from "@http/route-deno/static-route";
import { interceptResponse } from "@http/interceptor/intercept-response";
import { skip } from "@http/interceptor/skip";
import routes from "./routes.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("./cache")),
    skip(404, 405),
  ),
  routes,
]);
