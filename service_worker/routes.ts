import { byPattern } from "@http/fns/by_pattern";
import { cascade } from "@http/fns/cascade";
import calc_eval from "../routes/calc/eval.tsx";

export default cascade(
  byPattern("/calc/eval", calc_eval),
);
