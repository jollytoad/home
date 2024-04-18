import { handle } from "@http/route/handle";
import { staticRoute } from "@http/route-deno/static-route";
import { interceptResponse, skip } from "@http/interceptor/intercept";
import routes from "./routes.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("./cache")),
    skip(404, 405),
  ),
  routes,
]);
