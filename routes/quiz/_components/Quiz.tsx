import { Delayed } from "../../../components/Delayed.tsx";
import type { TextChoiceQuestion } from "../_trivia_api_types.ts";
import { QuizAnswer } from "./QuizAnswer.tsx";
import { QuizScore } from "./QuizScore.tsx";

interface QuizProps {
  score?: bigint;
}

export function Quiz({ score }: QuizProps) {
  return (
    <article class="quiz">
      <h2>Quiz</h2>

      <Question />

      <QuizScore score={score} />
    </article>
  );
}

async function Question() {
  try {
    const response = await fetch(
      "https://the-trivia-api.com/v2/questions?limit=1",
    );

    if (response.ok) {
      const questions = await response.json() as TextChoiceQuestion[];

      const { id, question: { text }, correctAnswer, incorrectAnswers } =
        questions[0];

      const answers = [correctAnswer, ...incorrectAnswers];
      answers.forEach(() => answers.sort(() => 0.5 - Math.random()));

      return (
        <div>
          <p class="question">{text}</p>
          <ol class="answers">
            {answers.map((answer, i) => (
              <Delayed delay={(i + 1) * 300}>
                <li class="answer">
                  <QuizAnswer id={id} answer={answer} />
                </li>
              </Delayed>
            ))}
          </ol>
          <p class="attribution">
            powered by{" "}
            <a href="https://the-trivia-api.com" target="_blank">
              The Trivia API
            </a>
          </p>
        </div>
      );
    } else {
      console.error("trivia api failed", response.status);
    }
  } catch (error) {
    console.error("trivia api failed", error);
  }

  return <p>Failed to fetch a question!</p>;
}
