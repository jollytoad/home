import type { Context, Tag, TagAdvice, TagHook } from "@http/html-stream/types";

export interface Injections {
  module?: string | string[];
  script?: string | string[];
  stylesheet?: string | string[];
}

export const recordScript: TagHook = {
  tag: "script",
  afterEnd: (tag: Tag, context: Context) => {
    if (typeof tag.attributes?.src === "string") {
      context.scripts.add(tag.attributes.src);
    }
  },
};

export const recordStylesheet: TagHook = {
  tag: "link",
  afterEnd: (tag: Tag, context: Context) => {
    if (
      tag.attributes?.rel === "stylesheet" &&
      typeof tag.attributes?.href === "string"
    ) {
      context.stylesheets.add(tag.attributes.href);
    }
  },
};

export function inject(
  fn: (tag: Tag) => Injections | void,
): TagAdvice {
  return function* (tag: Tag, context: Context) {
    const injections = fn(tag);

    for (const url of asArray(injections?.stylesheet)) {
      if (!context.stylesheets.has(url)) {
        yield <link rel="stylesheet" href={url} />;
      }
    }

    for (const url of asArray(injections?.module)) {
      if (!context.scripts.has(url)) {
        yield <script type="module" src={url} />;
      }
    }

    for (const url of asArray(injections?.script)) {
      if (!context.scripts.has(url)) {
        yield <script src={url} />;
      }
    }
  };
}

function asArray(value: undefined | string | string[]): string[] {
  return Array.isArray(value) ? value : value !== undefined ? [value] : [];
}
