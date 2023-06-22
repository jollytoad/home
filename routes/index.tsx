import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { handlePage } from "@/lib/route.ts";

export default handlePage(HomePage);

export function HomePage() {
  return (
    <Page>
      <ul>
        <li>
          <a href="/quiz">Quiz</a>
        </li>
        <li>
          <a href="/async">Async component streaming demo</a>
        </li>
      </ul>

      <hr />

      <Markdown url="@/blog/index.md" />
    </Page>
  );
}
