import type { RenderOptions } from "$jsx/types.ts";
import { materialDesign } from "@/lib/tag_hooks/material_design.ts";
import { shoelace } from "@/lib/tag_hooks/shoelace.ts";

export const PAGE_RENDER_OPTIONS: RenderOptions = {
  deferredTimeout: 10,

  tagHandlers: {
    ...materialDesign(),
    ...shoelace(),
  },
};

export const FRAGMENT_RENDER_OPTIONS: RenderOptions = {
  deferredTimeout: false,
};
