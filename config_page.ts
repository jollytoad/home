import type { RenderOptions } from "$jsx/types.ts";
import { materialDesignElements } from "@/lib/tag_hooks/material_design.ts";
import { shoelaceElements } from "@/lib/tag_hooks/shoelace.ts";
import { vaadinElements } from "@/lib/tag_hooks/vaadin.ts";
import { wiredElements } from "@/lib/tag_hooks/wired_elements.ts";
import { githubElements } from "@/lib/tag_hooks/github_elements.ts";
import { patternFlyElements } from "@/lib/tag_hooks/patternfly_elements.ts";

export const PAGE_RENDER_OPTIONS: RenderOptions = {
  deferredTimeout: 10,

  tagHandlers: {
    ...materialDesignElements(),
    ...shoelaceElements(),
    ...wiredElements(),
    ...vaadinElements(),
    ...githubElements(),
    ...patternFlyElements(),
  },
};
