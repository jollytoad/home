import { inject } from "./inject.tsx";
import type { TagHook } from "@http/html-stream/types";

const injectGH = inject((tag) => ({
  module: `https://esm.sh/@github/${tag.tagName}-element`,
}));

export function githubElements(): TagHook[] {
  return [{
    tag: "tab-container",
    beforeBegin: injectGH,
    // TODO: Add more GitHub elements as necessary
  }];
}
