import type { TagHandlers } from "@http/jsx-stream/types";
import { inject, recordScript } from "./inject.tsx";

const ignored = ["vaadin-tab"];

export function vaadinElements(): TagHandlers {
  return {
    ...recordScript,
    "vaadin-*": inject((tag) => {
      if (ignored.includes(tag.tagName)) {
        return;
      }
      const component = tag.tagName.replace(/^vaadin-/, "");
      return {
        module: `https://cdn.jsdelivr.net/esm/@vaadin/${component}`,
      };
    }),
  };
}
