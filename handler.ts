import { handle } from "$http_fns/handle.ts";
import { staticRoute } from "$http_fns/static.ts";
import { byPattern } from "$http_fns/pattern.ts";
import routes from "@/routes.ts";
import blogRoute from "@/routes/blog/:path*.tsx";

export default handle([
  byPattern("/blog/:path*{.:ext}", blogRoute),
  routes,
  staticRoute("/", import.meta.resolve("@/static")),
]);
