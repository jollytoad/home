import { byMethod } from "$http_fns/method.ts";
import { renderPage } from "@/lib/handle_page.ts";
import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { byMediaType } from "$http_fns/media_type.ts";
import { fetchContent } from "@/lib/content.ts";

export default byMethod({
  GET: byMediaType({
    "text/html": renderPage(({ match }) => {
      const url = moduleUrl(match);
      return (
        <Page module={url}>
          <Markdown url={url} />
          <script src="/prism.js" async></script>
        </Page>
      );
    }),
    "text/markdown": rawContent,
    "text/plain": rawContent,
  }),
});

function moduleUrl(match: URLPatternResult): string {
  const ext = match.pathname.groups.ext;
  const name = ext
    ? match.pathname.input.slice(0, -(ext.length + 1))
    : match.pathname.input;
  return import.meta.resolve(`@/routes${name}.md`);
}

function rawContent(_req: Request, match: URLPatternResult) {
  return fetchContent(moduleUrl(match));
}
