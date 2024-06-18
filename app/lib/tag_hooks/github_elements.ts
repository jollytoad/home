import type { TagHandlers } from "@http/jsx-stream/types";
import { inject, recordScript } from "./inject.tsx";

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
