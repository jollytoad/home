import { Page } from "@/components/Page.tsx";
import { handlePage } from "@/lib/handle_page.ts";
import { Markdown } from "@/components/Markdown.tsx";

export default handlePage(({ req }) => (
  <Page req={req} module={import.meta.url}>
    <h2>Server Sent Events Demo</h2>

    <Markdown>
      {`
This is a demo of streaming bursts of content via [SSE] using [htmx].

[SSE]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
[htmx]: https://htmx.org/extensions/server-sent-events

It consists of two elements, a _control_ and an _output_.

When you hit the **Start** button, a GET request is made to swap in a new _control_
element which provides the htmx attributes to kick off the SSE request, targetting the _output_
element.

The SSE feed returns a number of rendered items, and finishes with an out-of-band swap of the
_control_ element which terminates the SSE feed.
`}
    </Markdown>

    <h3>Control:</h3>

    <div class="box">
      <div id="control">
        <span>Feed has not started. Hit the button...&nbsp;</span>
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
