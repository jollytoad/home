import type { TagHandlers } from "$jsx/types.ts";
import { inject, recordScript } from "@/lib/tag_hooks/inject.tsx";

export function wiredElements(): TagHandlers {
  return {
    ...recordScript,
    "wired-*": inject((tag) => {
      return {
        module: `https://unpkg.com/wired-elements/lib/${tag.tagName}.js?module`,
      };
    }),
  };
}
