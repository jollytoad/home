import { byPattern } from "$http_fns/by_pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import calc_eval from "@/routes/calc/eval.tsx";

export default cascade(
  byPattern("/calc/eval", calc_eval),
);
