import type { TagHandlers } from "$jsx/types.ts";
import { inject, recordScript } from "@/lib/tag_hooks/inject.tsx";

export function patternFlyElements(): TagHandlers {
  return {
    ...recordScript,
    "pf-*": inject((tag) => {
      return {
        module:
          `https://jspm.dev/@patternfly/elements/${tag.tagName}/${tag.tagName}.js`,
      };
    }),
  };
}
