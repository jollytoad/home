import { inject } from "./inject.tsx";
import type { TagHook } from "@http/html-stream/types";

export function shoelaceElements(): TagHook[] {
  return [{
    tag: "sl-*",
    beforeBegin: inject(() => ({
      stylesheet:
        "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/themes/light.css",
      module:
        "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/shoelace-autoloader.js",
    })),
  }];
}
