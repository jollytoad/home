import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import calcEval from "@/routes/calc/eval.tsx";

export default cascade(
  byPattern("/calc/eval", calcEval),
);
