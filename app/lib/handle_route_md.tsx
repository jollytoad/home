import { renderPage } from "./handle_page.tsx";
import { Page } from "../components/Page.tsx";
import { Markdown } from "../components/Markdown.tsx";
import { byMediaType } from "@http/route/by-media-type";
import { fetchContent } from "../lib/content.ts";

export const GET = byMediaType({
  "text/html": renderPage(({ req, match }) => {
    const url = moduleUrl(match);
    return (
      <Page req={req} module={url}>
        <Markdown url={url} req={req} />
        <script src="/prism.js" async></script>
      </Page>
    );
  }),
  "text/markdown": rawContent,
  "text/plain": rawContent,
});

function moduleUrl(match: URLPatternResult): string {
  const ext = match.pathname.groups.ext;
  const name = ext
    ? match.pathname.input.slice(0, -(ext.length + 1))
    : match.pathname.input;
  return import.meta.resolve(`../routes${name}.md`);
}

function rawContent(_req: Request, match: URLPatternResult) {
  return fetchContent(moduleUrl(match));
}
