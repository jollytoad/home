import { fromMarkdown } from "https://esm.sh/mdast-util-from-markdown@1.3.1";
import { gfm } from "https://esm.sh/micromark-extension-gfm@2.0.3";
import { gfmFromMarkdown } from "https://esm.sh/mdast-util-gfm@2.0.2";
import { toHast } from "https://esm.sh/mdast-util-to-hast@12.3.0";
import {
  Options,
  toJsxRuntime,
} from "https://esm.sh/hast-util-to-jsx-runtime@1.2.0";
import { raw } from "https://esm.sh/hast-util-raw@8.0.0";
import { Fragment, jsx, jsxDEV, jsxs } from "$jsx/jsx-runtime";
import type { Promisable, StreamableNode } from "$jsx/types.ts";

interface Props {
  children?: Promisable<string>;
}

const options = {
  Fragment,
  jsx,
  jsxs,
  jsxDEV,
} as Options;

export async function Markdown(props: Props): Promise<StreamableNode> {
  const markdown = await props.children;
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
