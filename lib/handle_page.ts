import { renderHTML } from "$http_render_fns/render_html.tsx";
import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import type { ComponentType } from "$jsx/types.ts";
import { asRouteProps, type RouteProps } from "@/lib/route.ts";
import { PAGE_RENDER_OPTIONS } from "@/config_page.ts";
import { FRAGMENT_RENDER_OPTIONS } from "@/config_fragment.ts";

/**
 * Basic GET request handler that renders a HTML full page component,
 * passing the request and URL pattern match result as properties.
 */
export function handlePage(
  Component: ComponentType<RouteProps>,
  headers?: Record<string, string>,
) {
  return byMethod({
    GET: mapData(
      asRouteProps,
      (req, match) => {
        let options = req.headers.has("HX-Request")
          ? FRAGMENT_RENDER_OPTIONS
          : PAGE_RENDER_OPTIONS;

        const deferredTimeout = getDeferredTimeout(req);
        if (deferredTimeout !== undefined) {
          options = { ...options, deferredTimeout };
        }

        return renderHTML(Component, headers, options)(req, match);
      },
    ),
  });
}

function getDeferredTimeout(req: Request): number | false | undefined {
  if (req.headers.has("Deferred-Timeout")) {
    const deferredTimeoutHeader = req.headers.get("Deferred-Timeout");
    const deferredTimeout = deferredTimeoutHeader === "false"
      ? false
      : Number.parseInt(deferredTimeoutHeader ?? "");

    if (deferredTimeout === false || Number.isSafeInteger(deferredTimeout)) {
      return deferredTimeout;
    }
  }
}
