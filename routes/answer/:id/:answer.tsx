import { handleFragment } from "@/lib/handle_fragment.ts";
import { QuizAnswer } from "@/components/QuizAnswer.tsx";
import { notFound } from "$http_fns/response/not_found.ts";

export default handleFragment(
  async function AnswerResult({ match }) {
    let { id, answer } = match.pathname.groups;
    answer = decodeURIComponent(answer ?? "");

    if (!id) {
      throw notFound();
    }

    const question =
      await (await fetch(`https://the-trivia-api.com/api/question/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })).json();

    const correct = answer === question.correctAnswer;

    return <QuizAnswer id={id} answer={answer} correct={correct} />;
  },
);
