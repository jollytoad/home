// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import { lazy } from "$http_fns/lazy.ts";

export default cascade(
  byPattern("/tabs", lazy(() => import("./routes/tabs.tsx"))),
  byPattern("/quiz", lazy(() => import("./routes/quiz.tsx"))),
  byPattern("/ex/:from/:to", lazy(() => import("./routes/ex/:from/:to.tsx"))),
  byPattern("/ex", lazy(() => import("./routes/ex.tsx"))),
  byPattern("/calc/eval", lazy(() => import("./routes/calc/eval.tsx"))),
  byPattern("/calc", lazy(() => import("./routes/calc.tsx"))),
  byPattern("/blog/:path*", lazy(() => import("./routes/blog/:path*.tsx"))),
  byPattern("/async", lazy(() => import("./routes/async.tsx"))),
  byPattern("/answer/:id/:answer", lazy(() => import("./routes/answer/:id/:answer.tsx"))),
  byPattern("/", lazy(() => import("./routes/index.tsx"))),
);
