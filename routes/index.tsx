import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { handlePage } from "@/lib/handle_page.ts";

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
`}
      </Markdown>

      <Markdown url="@/routes/blog/index.md" />

      <Markdown url="@/routes/blog/links.md" />
    </Page>
  );
});
