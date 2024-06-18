import { Page } from "../components/Page.tsx";
import { Markdown } from "../components/Markdown.tsx";
import { handlePage } from "../lib/handle_page.ts";

export default handlePage(({ req }) => {
  return (
    <Page req={req} module={import.meta.url}>
      <Markdown>
        {`
## Demos and Experiments

* [Quiz](/quiz)
* [Async component streaming demo](/async)
* [Service Worker Calculator](/calc)
* [Web Components demo](/tabs)
* [Todo List demo](/todo)
* [Server Sent Events demo](/sse)
* [Quote of the Moment](/quote)
`}
      </Markdown>

      <Markdown url={import.meta.resolve("./blog/index.md")} />

      <Markdown url={import.meta.resolve("./blog/links.md")} />

      <div id="wcb" class="carbonbadge"></div>
      <script
        src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js"
        defer
      >
      </script>
    </Page>
  );
});
