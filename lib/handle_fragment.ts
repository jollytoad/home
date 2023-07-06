import { renderHTML } from "$http_render_fns/render_html.tsx";
import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import { FRAGMENT_RENDER_OPTIONS } from "@/config_fragment.ts";
import type { ComponentType } from "$jsx/types.ts";
import { asRouteProps, type RouteProps } from "@/lib/route.ts";

/**
 * Basic GET request handler that renders a HTML fragment component,
 * passing the request and URL pattern match result as properties.
 */
export function handleFragment(
  Component: ComponentType<RouteProps>,
  headers?: Record<string, string>,
) {
  return byMethod({
    GET: mapData(
      asRouteProps,
      renderHTML(Component, headers, FRAGMENT_RENDER_OPTIONS),
    ),
  });
}
