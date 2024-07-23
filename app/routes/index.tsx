import { Markdown } from "../components/Markdown.tsx";
import type { RequestProps } from "../lib/types.ts";

export function Home({ req }: RequestProps) {
  return (
    <>
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

      <Markdown url={import.meta.resolve("./blog/blogs.md")} req={req} />

      <Markdown url={import.meta.resolve("./blog/links.md")} req={req} />

      <div id="wcb" class="carbonbadge"></div>
      <script
        src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js"
        defer
      >
      </script>
    </>
  );
}
