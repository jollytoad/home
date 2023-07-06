import type { TagHandlers } from "$jsx/types.ts";
import {
  inject,
  recordScript,
  recordStylesheet,
} from "@/lib/tag_hooks/inject.tsx";

export function shoelace(): TagHandlers {
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
