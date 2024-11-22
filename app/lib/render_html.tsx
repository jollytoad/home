import { renderHtmlResponse } from "@http/html-stream/render-html-response";
import type { ComponentType } from "@http/jsx-stream/types";
import type { RenderOptions } from "@http/token-stream/types";
import type { HtmlToken } from "@http/html-stream/types";

// deno-lint-ignore ban-types
export function renderHTML<P extends {}>(
  Component: ComponentType<P>,
  props: P,
  headers?: HeadersInit,
  options?: RenderOptions<HtmlToken>,
) {
  return renderHtmlResponse(<Component {...props} />, { ...options, headers });
}
