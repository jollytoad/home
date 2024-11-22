import type { TagHook } from "@http/html-stream/types";
import { inject } from "./inject.tsx";

export function wiredElements(): TagHook[] {
  return [{
    tag: "wired-*",
    beforeBegin: inject((tag) => {
      return {
        module: `https://unpkg.com/wired-elements/lib/${tag.tagName}.js?module`,
      };
    }),
  }];
}
