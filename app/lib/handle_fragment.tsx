import { byMethod } from "@http/route/by-method";
import type { ComponentType } from "@http/jsx-stream/types";
import type { RouteProps } from "./types.ts";
import { renderHtmlResponse } from "@http/html-stream/render-html-response";

/**
 * Basic GET request handler that renders a HTML fragment component,
 * passing the request and URL pattern match result as properties.
 */
export function handleFragment(
  Component: ComponentType<RouteProps>,
  headers?: HeadersInit,
) {
  return byMethod({
    GET: (req: Request, match: URLPatternResult) =>
      renderHtmlResponse(<Component req={req} match={match} />, { headers }),
  });
}
