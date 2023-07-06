import { Page } from "@/components/Page.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import { handlePage, RouteProps } from "@/lib/route.ts";

export default handlePage(HomePage);

export function HomePage({ req }: RouteProps) {
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
      </ul>

      <hr />

      <Markdown url="@/blog/index.md" />
    </Page>
  );
}
