import { withFallback } from "@http/route/with-fallback";
import { intercept } from "@http/interceptor/intercept";
import { logging } from "@http/interceptor/logger";
import type { Awaitable } from "@http/route/types";
import type { Interceptors } from "@http/interceptor/types";

export interface ServeOptions<E> {
  fetch(req: Request, env: E): Awaitable<Response>;
}

/**
 * Convenience function to generate Hono serve init parameter for localhost dev mode.
 */
// deno-lint-ignore require-await
export default async function initHonoNodeServer<E = unknown>(
  handler: (
    req: Request,
    env: E,
  ) => Awaitable<Response | null>,
  ...interceptors: Interceptors<unknown[], Response>[]
): Promise<ServeOptions<E>> {
  return {
    fetch: intercept(withFallback(handler), logging(), ...interceptors),
  };
}
