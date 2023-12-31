// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/by_pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import { lazy } from "$http_fns/lazy.ts";

export default cascade(
  byPattern("/todo/:listId/:itemId", lazy(() => import("./routes/todo/:listId/:itemId.tsx"))),
  byPattern("/todo/:listId", lazy(() => import("./routes/todo/:listId/index.tsx"))),
  byPattern("/todo", lazy(() => import("./routes/todo/index.ts"))),
  byPattern("/tabs", lazy(() => import("./routes/tabs.tsx"))),
  byPattern("/sse/stop", lazy(() => import("./routes/sse/stop.tsx"))),
  byPattern("/sse/start", lazy(() => import("./routes/sse/start.tsx"))),
  byPattern("/sse/feed", lazy(() => import("./routes/sse/feed.tsx"))),
  byPattern("/sse", lazy(() => import("./routes/sse/index.tsx"))),
  byPattern("/sleep", lazy(() => import("./routes/sleep.ts"))),
  byPattern("/quiz/answer/:id/:answer", lazy(() => import("./routes/quiz/answer/:id/:answer.tsx"))),
  byPattern("/quiz", lazy(() => import("./routes/quiz/index.tsx"))),
  byPattern("/ex/:from/:to", lazy(() => import("./routes/ex/:from/:to.tsx"))),
  byPattern("/ex", lazy(() => import("./routes/ex/index.tsx"))),
  byPattern("/calc/eval", lazy(() => import("./routes/calc/eval.tsx"))),
  byPattern("/calc", lazy(() => import("./routes/calc/index.tsx"))),
  byPattern(["/blog/md{.:ext}?","/blog/links{.:ext}?","/blog/jsx_streaming{.:ext}?","/blog/index{.:ext}","/blog/http_fns{.:ext}?","/blog/dependency_hell{.:ext}?"], lazy(() => import("./lib/handle_route_md.tsx"))),
  byPattern(["/blog/dep_hell.excalidraw.png","/blog/dep_heaven.excalidraw.png"], lazy(() => import("./lib/handle_route_static.ts"))),
  byPattern("/blog", lazy(() => import("./lib/handle_route_md.tsx"))),
  byPattern("/auth/widget", lazy(() => import("./routes/auth/widget.tsx"))),
  byPattern("/auth/signout", lazy(() => import("./routes/auth/signout.ts"))),
  byPattern("/auth/:provider/signin", lazy(() => import("./routes/auth/:provider/signin.ts"))),
  byPattern("/auth/:provider/callback", lazy(() => import("./routes/auth/:provider/callback.ts"))),
  byPattern("/async", lazy(() => import("./routes/async.tsx"))),
  byPattern("/", lazy(() => import("./routes/index.tsx"))),
);
