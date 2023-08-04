import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { handlePage } from "@/lib/handle_page.ts";

export default handlePage(({ req }) => {
  return (
    <Page req={req} module={import.meta.url}>
      <ul>
        <li>
          <a href="/quiz">Quiz</a>
        </li>
        <li>
          <a href="/async">Async component streaming demo</a>
        </li>
        <li>
          <a href="/calc">Service Worker Calculator</a>
        </li>
        <li>
          <a href="/tabs">Web Components demo</a>
        </li>
        <li>
          <a href="/todo">Todo List demo</a>
        </li>
      </ul>

      <Markdown url="@/routes/blog/index.md" />

      <Markdown url="@/routes/blog/links.md" />
    </Page>
  );
});
