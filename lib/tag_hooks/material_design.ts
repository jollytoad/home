import type { TagHandlers } from "@http/jsx-stream/types";
import { inject, recordScript } from "./inject.tsx";

const mdComponents: Record<string, string> = {
  "md-tab": "tabs/tab",
  // TODO: add more mappings as necessary
};

export function materialDesignElements(): TagHandlers {
  return {
    ...recordScript,
    "md-*": inject((tag) => {
      const component = tag.tagName.replace(/^md-/, "");
      const componentPath = mdComponents[tag.tagName] ??
        `${component}/${component}`;
      return {
        module: `https://esm.sh/@material/web/${componentPath}.js`,
      };
    }),
  };
}
