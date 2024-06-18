import { byPattern } from "@http/route/by-pattern";
import { cascade } from "@http/route/cascade";
import calc_eval from "../app/routes/calc/eval.tsx";

export default cascade(
  byPattern("/calc/eval", calc_eval),
);
