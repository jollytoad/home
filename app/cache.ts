import { staticRoute } from "@http/route-deno/static-route";
import { interceptResponse } from "@http/interceptor/intercept-response";
import { skip } from "@http/interceptor/skip";

export default interceptResponse(
  staticRoute("/", import.meta.resolve("./cache")),
  skip(404, 405),
);
