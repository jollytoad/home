import { Page } from "@/components/Page.tsx";
import { Quiz } from "./_components/Quiz.tsx";
import { renderPage } from "@/lib/handle_page.ts";
import { byMethod } from "$http_fns/by_method.ts";
import { getQuizSession } from "@/routes/quiz/_lib/session.ts";

export default byMethod({
  GET: async (req, match: URLPatternResult) => {
    const { score, headers } = await getQuizSession(req);

    return renderPage(() => (
      <Page req={req} module={import.meta.url}>
        <Quiz score={score} />
        <a href="/quiz">Next Question</a>
      </Page>
    ), headers)(req, match);
  },
});
