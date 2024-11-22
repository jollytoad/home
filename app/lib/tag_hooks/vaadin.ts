import type { TagHook } from "@http/html-stream/types";
import { inject } from "./inject.tsx";

const ignored = ["vaadin-tab"];

export function vaadinElements(): TagHook[] {
  return [{
    tag: "vaadin-*",
    beforeBegin: inject((tag) => {
      if (ignored.includes(tag.tagName)) {
        return;
      }
      const component = tag.tagName.replace(/^vaadin-/, "");
      return {
        module: `https://cdn.jsdelivr.net/esm/@vaadin/${component}`,
      };
    }),
  }];
}
