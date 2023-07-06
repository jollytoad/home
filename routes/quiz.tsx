import { Page } from "@/components/Page.tsx";
import { Quiz } from "@/components/Quiz.tsx";
import { handlePage } from "@/lib/handle_page.ts";

export default handlePage(({ req }) => (
  <Page req={req} module={import.meta.url}>
    <Quiz />
    <a href="/quiz">Next Question</a>
  </Page>
));
