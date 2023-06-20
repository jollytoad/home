import { Markdown } from "./Markdown.tsx";
import { Page } from "./Page.tsx";
import type { ContentProps } from "@/lib/content.ts";

// deno-lint-ignore no-empty-interface
export interface BlogProps extends ContentProps {
}

export function Blog(props: BlogProps) {
  return (
    <Page>
      <Markdown>{props.content.text()}</Markdown>
    </Page>
  );
}
