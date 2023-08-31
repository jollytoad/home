interface Props {
  id: string;
  answer: string;
  correct?: boolean;
  reqURL?: string;
}

export function QuizAnswer({ reqURL = "", id, answer, correct }: Props) {
  if (correct !== undefined) {
    const cls = correct ? "correct" : "incorrect";
    const text = correct ? "Correct" : "Incorrect";

    return <button class={cls}>{answer} - {text}</button>;
  } else {
    return (
      <button
        hx-get={`${reqURL}/quiz/answer/${id}/${encodeURIComponent(answer)}`}
        hx-swap="outerHTML"
      >
        {answer}
      </button>
    );
  }
}
