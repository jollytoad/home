// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import { lazy } from "$http_fns/lazy.ts";

export default cascade(
  byPattern("/todo/:listId/:itemId", lazy(() => import("./routes/todo/:listId/:itemId.tsx"))),
  byPattern("/todo/:listId", lazy(() => import("./routes/todo/:listId/index.tsx"))),
  byPattern("/todo", lazy(() => import("./routes/todo/index.ts"))),
  byPattern("/tabs", lazy(() => import("./routes/tabs.tsx"))),
  byPattern("/sse/start", lazy(() => import("./routes/sse/start.tsx"))),
  byPattern("/sse/feed", lazy(() => import("./routes/sse/feed.tsx"))),
  byPattern("/sse", lazy(() => import("./routes/sse/index.tsx"))),
  byPattern("/sleep", lazy(() => import("./routes/sleep.ts"))),
  byPattern("/quiz", lazy(() => import("./routes/quiz.tsx"))),
  byPattern("/ex/:from/:to", lazy(() => import("./routes/ex/:from/:to.tsx"))),
  byPattern("/ex", lazy(() => import("./routes/ex/index.tsx"))),
  byPattern("/calc/eval", lazy(() => import("./routes/calc/eval.tsx"))),
  byPattern("/calc", lazy(() => import("./routes/calc/index.tsx"))),
  byPattern(["/blog/md{.:ext}?","/blog/links{.:ext}?","/blog/jsx_streaming{.:ext}?","/blog/index{.:ext}","/blog/http_fns{.:ext}?","/blog"], lazy(() => import("./lib/handle_route_md.tsx"))),
  byPattern("/async", lazy(() => import("./routes/async.tsx"))),
  byPattern("/answer/:id/:answer", lazy(() => import("./routes/answer/:id/:answer.tsx"))),
  byPattern("/", lazy(() => import("./routes/index.tsx"))),
);
