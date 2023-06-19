import { renderHTML } from "$http_render_fns/render_html.tsx";
import { byMethod } from "$http_fns/method.ts";
import { Page } from "@/components/Page.tsx";

export default byMethod({
  GET: renderHTML(HomePage, {
    "AHX-Full-Page": "true",
  }),
});

export function HomePage() {
  return (
    <Page>
      <div>
        TODO: Add stuff here
      </div>

      <h2>Blog</h2>

      <ol>
        <li>
          <a href="/blog/hello">Hello</a>
        </li>
      </ol>
    </Page>
  );
}
