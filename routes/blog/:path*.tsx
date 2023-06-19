import { byMethod } from "$http_fns/method.ts";
import { byMediaType } from "$http_fns/media_type.ts";
import { mapData } from "$http_fns/map.ts";
import { renderHTML } from "$http_render_fns/render_html.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { Page } from "@/components/Page.tsx";
import { ContentStreamProps, getContentStreamForPath } from "@/lib/content.ts";

export default byMethod({
  GET: mapData(
    getContentStreamForPath(`@/blog`),
    byMediaType({
      "text/html": renderHTML(Blog),
      "text/markdown": raw,
      "text/plain": raw,
    }),
  ),
});

// deno-lint-ignore no-empty-interface
interface Props extends ContentStreamProps {
}

export function Blog(props: Props) {
  return (
    <Page>
      <Markdown>{props.content.text()}</Markdown>
    </Page>
  );
}

function raw(_req: Request, { content }: Props) {
  return content;
}
