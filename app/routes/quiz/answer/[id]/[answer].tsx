import { handleFragment } from "../../../../lib/handle_fragment.ts";
import { QuizAnswer } from "../../_components/QuizAnswer.tsx";
import { notFound } from "@http/response/not-found";
import { getQuizSession, updateQuizScore } from "../../_lib/session.ts";
import { QuizScore } from "../../_components/QuizScore.tsx";
import type { TextChoiceQuestion } from "../../_trivia_api_types.ts";

export default handleFragment(
  async function AnswerResult({ req, match }) {
    const { id: sessionId } = await getQuizSession(req);

    console.log(sessionId);

    let { id: answerId, answer } = match.pathname.groups;
    answer = decodeURIComponent(answer ?? "");

    if (!answerId) {
      throw notFound();
    }

    const question = await (await fetch(
      `https://the-trivia-api.com/api/question/${answerId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )).json() as TextChoiceQuestion;

    const correct = answer === question.correctAnswer;

    let score = undefined;

    if (sessionId) {
      try {
        ({ score } = await updateQuizScore(sessionId, correct));
        console.log(score);
      } catch (e) {
        console.error(e);
      }
    }

    return (
      <>
        <QuizAnswer id={answerId} answer={answer} correct={correct} />
        <QuizScore score={score} oob={true} />
      </>
    );
  },
);
