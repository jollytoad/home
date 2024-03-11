import { handle } from "@http/fns/handle";
import { staticRoute } from "@http/fns/static_route";
import { interceptResponse, skip } from "@http/fns/intercept";
import routes from "./routes.ts";

export default handle([
  interceptResponse(
    staticRoute("/", import.meta.resolve("./cache")),
    skip(404, 405),
  ),
  routes,
  staticRoute("/", import.meta.resolve("./static")),
]);
