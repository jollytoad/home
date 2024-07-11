#!/usr/bin/env -S bunx wrangler dev

import handler from "./handler.ts";
import { setStore } from "@jollytoad/store";
import type { Awaitable } from "@http/route/types";
import type { Interceptors } from "@http/interceptor/types";
import { intercept } from "@http/interceptor/intercept";
import { withFallback } from "@http/route/with-fallback";
import { logging } from "@http/interceptor/logger";

setStore(import("@jollytoad/store-no-op"));

export default init(handler);

function init(
  handler: (
    req: Request,
  ) => Awaitable<Response | null>,
  ...interceptors: Interceptors<unknown[], Response>[]
) {
  return {
    fetch: intercept(withFallback(handler), logging(), ...interceptors),
  };
}
