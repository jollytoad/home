#!/usr/bin/env -S bunx wrangler dev

import handler from "./handler.ts";
import { setStore } from "@jollytoad/store";
import type { Awaitable } from "@http/route/types";
import type { Interceptors } from "@http/interceptor/types";
import { intercept } from "@http/interceptor/intercept";
import { withFallback } from "@http/route/with-fallback";
import { logging } from "@http/interceptor/logger";
import { envInterceptor } from "./lib/env.ts";
import { handleAsset } from "./lib/cloudflare_assets.ts";
import { interceptResponse } from "@http/interceptor/intercept-response";
import { skip } from "@http/interceptor/skip";
import { cascade } from "@http/route/cascade";
import { byMethod } from "@http/route/by-method";

setStore(import("@jollytoad/store-no-op"));

const assets = interceptResponse(
  byMethod({
    GET: handleAsset,
  }),
  skip(404, 405),
);

export default init(cascade(assets, handler));

function init(
  handler: (
    req: Request,
  ) => Awaitable<Response | null>,
  ...interceptors: Interceptors<unknown[], Response>[]
) {
  return {
    fetch: intercept(
      withFallback(handler),
      logging(),
      envInterceptor(),
      ...interceptors,
    ),
  };
}
