import { byMethod } from "@http/fns/by_method";
import type { ComponentType } from "$jsx/types";
import type { RouteProps } from "./route.ts";
import { PAGE_RENDER_OPTIONS } from "../config_page.ts";
import { FRAGMENT_RENDER_OPTIONS } from "../config_fragment.ts";
import { getDeferredTimeout } from "./deferred_timeout.ts";
import { renderHTML } from "./render_html.tsx";

/**
 * Basic GET request handler that renders a HTML full page component,
 * passing the request and URL pattern match result as properties.
 */
export function handlePage(
  Component: ComponentType<RouteProps>,
  headers?: HeadersInit,
) {
  return byMethod({
    GET: renderPage(Component, headers),
  });
}

export function renderPage(
  Component: ComponentType<RouteProps>,
  headers?: HeadersInit,
) {
  return (req: Request, match: URLPatternResult) => {
    let options = req.headers.has("HX-Request")
      ? FRAGMENT_RENDER_OPTIONS
      : PAGE_RENDER_OPTIONS;

    const deferredTimeout = getDeferredTimeout(req);
    if (deferredTimeout !== undefined) {
      options = { ...options, deferredTimeout };
    }

    return renderHTML(Component, { req, match }, headers, options);
  };
}
