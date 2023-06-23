import { Page } from "@/components/Page.tsx";
import { Quiz } from "@/components/Quiz.tsx";
import { handlePage } from "@/lib/route.ts";

export default handlePage(({ req }) => (
  <Page req={req}>
    <Quiz />
    <a href="/quiz">Next Question</a>
  </Page>
));
