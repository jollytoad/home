interface Props {
  score?: bigint;
  oob?: boolean;
}

export function QuizScore({ score, oob }: Props) {
  if (score === undefined) {
    return null;
  }
  if (oob) {
    return <span id="quiz-score" hx-swap-oob="outerHTML">{score}</span>;
  } else {
    return (
      <p>
        Score: <span id="quiz-score">{score}</span>
      </p>
    );
  }
}
