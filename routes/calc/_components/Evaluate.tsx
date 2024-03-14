import { evaluate } from "../_lib/evaluate.js";
import { getSearchValues } from "@http/fns/request/search_values";

interface Props {
  expr: string;
}

export async function Evaluate({ expr }: Props) {
  if (expr) {
    console.log("Calculating...", expr);

    await new Promise((resolve) => setTimeout(resolve, 1));

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

export function evaluatePropsFrom(req?: Request): Props {
  return {
    expr: req && getSearchValues(req)("expr")[0] || "",
  };
}
