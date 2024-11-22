import type { TagHook } from "@http/html-stream/types";
import { inject } from "./inject.tsx";

const mdComponents: Record<string, string> = {
  "md-tab": "tabs/tab",
  // TODO: add more mappings as necessary
};

export function materialDesignElements(): TagHook[] {
  return [{
    tag: "md-*",
    beforeBegin: inject((tag) => {
      const component = tag.tagName.replace(/^md-/, "");
      const componentPath = mdComponents[tag.tagName] ??
        `${component}/${component}`;
      return {
        module: `https://esm.sh/@material/web/${componentPath}.js`,
      };
    }),
  }];
}
