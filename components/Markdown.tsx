import { fromMarkdown } from "https://esm.sh/mdast-util-from-markdown@2.0.0";
import { gfm } from "https://esm.sh/micromark-extension-gfm@3.0.0";
import { gfmFromMarkdown } from "https://esm.sh/mdast-util-gfm@3.0.0";
import { toHast } from "https://esm.sh/mdast-util-to-hast@13.0.2";
import {
  type Options,
  toJsxRuntime,
} from "https://esm.sh/hast-util-to-jsx-runtime@2.2.0";
import { raw } from "https://esm.sh/hast-util-raw@9.0.1";
import { Fragment, jsx, jsxDEV, jsxs } from "$jsx/jsx-runtime";
import { fetchContent } from "@/lib/content.ts";
import type { Promisable } from "$jsx/types.ts";

interface Props {
  url?: string;
  children?: Promisable<string>;
}

const options = {
  Fragment,
  jsx,
  jsxs,
  jsxDEV,
  elementAttributeNameCase: "html",
  stylePropertyNameCase: "css",
} as Options;

export async function Markdown(props: Props) {
  let markdown: string | undefined;

  if (props.url) {
    const response = await fetchContent(props.url);
    if (response.ok) {
      markdown = await response.text();
    }
  }

  if (!markdown) {
    markdown = await props.children;
  }

  const mdast = markdown
    ? fromMarkdown(markdown, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()],
    })
    : undefined;

  let hast = mdast ? toHast(mdast, { allowDangerousHtml: true }) : undefined;
  hast = hast ? raw(hast) : undefined;

  return hast ? toJsxRuntime(hast, options) : null;
}
