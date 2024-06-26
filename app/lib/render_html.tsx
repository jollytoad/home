import { html } from "@http/response/html";
import { prependDocType } from "@http/response/prepend-doctype";
import {
  type ComponentType,
  renderBody,
  type RenderOptions,
} from "@http/jsx-stream";

// deno-lint-ignore ban-types
export function renderHTML<P extends {}>(
  Component: ComponentType<P>,
  props: P,
  headers?: HeadersInit,
  options?: RenderOptions,
) {
  return html(
    prependDocType(
      renderBody(<Component {...props} />, options),
    ),
    headers,
  );
}
