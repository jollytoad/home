import { byMethod } from "@http/fns/by_method";
import { FRAGMENT_RENDER_OPTIONS } from "../config_fragment.ts";
import type { ComponentType } from "$jsx/types";
import type { RouteProps } from "./types.ts";
import { renderHTML } from "./render_html.tsx";

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
      renderHTML(Component, { req, match }, headers, FRAGMENT_RENDER_OPTIONS),
  });
}
