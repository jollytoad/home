// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import route_1 from "./routes/tabs.tsx";
import route_2 from "./routes/quiz.tsx";
import route_3 from "./routes/ex/:from/:to.tsx";
import route_4 from "./routes/ex.tsx";
import route_5 from "./routes/calc/eval.tsx";
import route_6 from "./routes/calc.tsx";
import route_7 from "./routes/blog/:path*.tsx";
import route_8 from "./routes/async.tsx";
import route_9 from "./routes/answer/:id/:answer.tsx";
import route_10 from "./routes/index.tsx";

export default cascade(
  byPattern("/tabs", route_1),
  byPattern("/quiz", route_2),
  byPattern("/ex/:from/:to", route_3),
  byPattern("/ex", route_4),
  byPattern("/calc/eval", route_5),
  byPattern("/calc", route_6),
  byPattern("/blog/:path*", route_7),
  byPattern("/async", route_8),
  byPattern("/answer/:id/:answer", route_9),
  byPattern("/", route_10),
);
