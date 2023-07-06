import type { TagHandlers } from "$jsx/types.ts";
import { inject, recordScript } from "@/lib/tag_hooks/inject.tsx";

const injectGH = inject((tag) => ({
  module: `https://esm.sh/@github/${tag.tagName}-element`,
}));

export function githubElements(): TagHandlers {
  return {
    ...recordScript,
    "tab-container": injectGH,
    // TODO: Add more GitHub elements as necessary
  };
}
