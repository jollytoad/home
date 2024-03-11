import type { TagHandlers } from "$jsx/types";
import { inject, recordScript } from "./inject.tsx";

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
