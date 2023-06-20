import { renderHTML } from "$http_render_fns/render_html.tsx";
import { byMethod } from "$http_fns/method.ts";
import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { Delayed } from "@/components/Delayed.tsx";
import { Trickled } from "@/components/Trickled.tsx";
import { Quiz } from "../components/Quiz.tsx";

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

      <hr />

      {
        /* <ol>
        <Trickled delay={1000}>
          <li>one</li>
          <li>two</li>
          <li>three</li>
          <li>four</li>
        </Trickled>
      </ol> */
      }

      <Markdown url="@/blog/index.md" />

      <hr />

      <Quiz />

      <hr />

      <Delayed delay={2000}>
        <div class="red">
          This renders after 2 seconds
        </div>
      </Delayed>

      <Delayed delay={3000}>
        <div class="red">
          This renders after 3 seconds
        </div>
      </Delayed>

      <Delayed delay={1000}>
        <div class="red">
          This renders after 1 second
        </div>
      </Delayed>
    </Page>
  );
}
