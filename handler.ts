import { handle } from "$http_fns/handle.ts";
import { staticRoute } from "$http_fns/static.ts";
import routes from "./routes.ts";

export default handle([
  routes,
  staticRoute("/", import.meta.resolve("./static")),
]);
