import { delay } from "$std/async/delay.ts";
import { evaluate } from "@/lib/evaluate.js";

interface Props {
  expr: string;
}

export async function Evaluate({ expr }: Props) {
  if (expr) {
    console.log("Calculating...", expr);

    await delay(10);

    try {
      const result = evaluate(expr);

      console.log("The answer is:", result);

      if (!Number.isNaN(result)) {
        return <output class="result" id="result">{result}</output>;
      }
    } catch (e) {
      console.error(e);
    }

    return <output class="error" id="result">Error</output>;
  } else {
    return <output class="blank" id="result">&nbsp;</output>;
  }
}
