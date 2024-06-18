import type { TagHandlers } from "@http/jsx-stream/types";
import { inject, recordScript } from "./inject.tsx";

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
