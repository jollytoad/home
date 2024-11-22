import { inject } from "./inject.tsx";
import type { TagHook } from "@http/html-stream/types";

export function patternFlyElements(): TagHook[] {
  return [{
    tag: "pf-*",
    beforeBegin: inject((tag) => {
      return {
        module:
          `https://jspm.dev/@patternfly/elements/${tag.tagName}/${tag.tagName}.js`,
      };
    }),
  }];
}
