import { Delayed } from "./Delayed.tsx";
import { QuizAnswer } from "./QuizAnswer.tsx";

export function Quiz() {
  return (
    <article class="quiz">
      <h2>Quiz</h2>

      <Question />
    </article>
  );
}

async function Question() {
  try {
    const response = await fetch(
      "https://the-trivia-api.com/v2/questions?limit=1",
    );

    if (response.ok) {
      const questions = await response.json();

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