import { Page } from "@/components/Page.tsx";
import { handlePage } from "@/lib/handle_page.ts";
import { Markdown } from "@/components/Markdown.tsx";

export default handlePage(({ req }) => (
  <Page req={req} module={import.meta.url}>
    <h2>Server Sent Events Demo</h2>

    <details open>
      <summary>What is this?</summary>
      <Markdown url="@/routes/sse/_doc.md" />
    </details>

    <h3>Control:</h3>

    <div class="box">
      <div id="control">
        <span>Feed has not yet started. Hit the button...&nbsp;</span>
        <button hx-get="/sse/start" hx-target="#control" hx-swap="outerHTML">
          Start
        </button>
      </div>
    </div>

    <h3>Output:</h3>

    <div class="box">
      <div id="output">
        <div>Feed appears here:</div>
      </div>
    </div>
  </Page>
));
