import { Markdown } from "./Markdown.tsx";
import { Page } from "./Page.tsx";
import type { ContentProps } from "@/lib/content.ts";

// deno-lint-ignore no-empty-interface
export interface BlogProps extends ContentProps {
}

export function Blog({ req, content }: BlogProps) {
  return (
    <Page req={req}>
      <Markdown>{content.text()}</Markdown>
      <script src="/prism.js" async></script>
    </Page>
  );
}
