import type { TagHandlers } from "@http/jsx-stream/types";
import { inject, recordScript, recordStylesheet } from "./inject.tsx";

export function shoelaceElements(): TagHandlers {
  return {
    ...recordScript,
    ...recordStylesheet,
    "sl-*": inject(() => ({
      stylesheet:
        "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/themes/light.css",
      module:
        "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.5.2/cdn/shoelace-autoloader.js",
    })),
  };
}
