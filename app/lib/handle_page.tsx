import { byMethod } from "@http/route/by-method";
import type { ComponentType } from "@http/jsx-stream/types";
import type { RouteProps } from "./types.ts";
import { getDeferredTimeout } from "./deferred_timeout.ts";
import type { RenderOptions } from "@http/token-stream/types";
import type { HtmlToken } from "@http/html-stream/types";
import { htmlDeferralHandler } from "@http/html-stream/html-deferral-handler";
import { tagHooks } from "@http/html-stream/transform/tag-hooks";
import { recordScript, recordStylesheet } from "./tag_hooks/inject.tsx";
import { materialDesignElements } from "./tag_hooks/material_design.ts";
import { shoelaceElements } from "./tag_hooks/shoelace.ts";
import { wiredElements } from "./tag_hooks/wired_elements.ts";
import { vaadinElements } from "./tag_hooks/vaadin.ts";
import { githubElements } from "./tag_hooks/github_elements.ts";
import { patternFlyElements } from "./tag_hooks/patternfly_elements.ts";
import { renderHtmlResponse } from "@http/html-stream/render-html-response";

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
    return renderHtmlResponse(<Component req={req} match={match} />, {
      ...renderOptions(req),
      headers,
    });
  };
}

function renderOptions(req: Request): RenderOptions<HtmlToken> {
  if (req.headers.has("HX-Request")) {
    return {};
  } else {
    const timeout = getDeferredTimeout(req) ?? 100;

    return {
      deferralHandler: typeof timeout === "number"
        ? htmlDeferralHandler({ timeout })
        : undefined,

      transformers: [
        tagHooks(
          recordScript,
          recordStylesheet,
          ...materialDesignElements(),
          ...shoelaceElements(),
          ...wiredElements(),
          ...vaadinElements(),
          ...githubElements(),
          ...patternFlyElements(),
        ),
      ],
    };
  }
}
