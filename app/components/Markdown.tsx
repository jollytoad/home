import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { type Options, toJsxRuntime } from "hast-util-to-jsx-runtime";
import { raw } from "hast-util-raw";
import * as jsxRuntime from "@http/jsx-stream/jsx-runtime";
import { fetchContent } from "../lib/content.ts";
import type { Awaitable } from "@http/token-stream/types";

interface Props {
  url?: string;
  children?: Awaitable<string>;
  req?: Request;
}

const options = {
  ...jsxRuntime,
  elementAttributeNameCase: "html",
  stylePropertyNameCase: "css",
} as Options;

export async function Markdown(props: Props) {
  let markdown: string | undefined;

  if (props.url) {
    const response = await fetchContent(props.url, props.req);
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
