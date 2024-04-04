// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byMethod } from "@http/fns/by_method";
import { lazy } from "@http/fns/lazy";
import { byPattern } from "@http/fns/by_pattern";
import { cascade } from "@http/fns/cascade";

export default cascade(
  byPattern("/todo/:listId/:itemId", lazy(async () => byMethod(await import("./routes/todo/:listId/:itemId.tsx")))),
  byPattern("/todo/:listId", lazy(async () => byMethod(await import("./routes/todo/:listId/index.tsx")))),
  byPattern("/todo", lazy(async () => byMethod(await import("./routes/todo/index.ts")))),
  byPattern("/tabs", lazy(() => import("./routes/tabs.tsx"))),
  byPattern("/sse/stop", lazy(() => import("./routes/sse/stop.tsx"))),
  byPattern("/sse/start", lazy(() => import("./routes/sse/start.tsx"))),
  byPattern("/sse/feed", lazy(() => import("./routes/sse/feed.tsx"))),
  byPattern("/sse", lazy(() => import("./routes/sse/index.tsx"))),
  byPattern("/sleep", lazy(() => import("./routes/sleep.ts"))),
  byPattern("/quote/tv", lazy(() => import("./routes/quote/tv.ts"))),
  byPattern("/quote/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/quote", lazy(() => import("./routes/quote/index.tsx"))),
  byPattern("/quiz/answer/:id/:answer", lazy(() => import("./routes/quiz/answer/:id/:answer.tsx"))),
  byPattern("/quiz", lazy(() => import("./routes/quiz/index.tsx"))),
  byPattern("/ex/:from/:to", lazy(() => import("./routes/ex/:from/:to.tsx"))),
  byPattern("/ex", lazy(() => import("./routes/ex/index.tsx"))),
  byPattern("/calc/eval", lazy(() => import("./routes/calc/eval.tsx"))),
  byPattern("/calc", lazy(() => import("./routes/calc/index.tsx"))),
  byPattern(["/blog/md{.:ext}?","/blog/links{.:ext}?","/blog/jsx_streaming{.:ext}?","/blog/index{.:ext}","/blog/http_fns{.:ext}?","/blog/dependency_hell{.:ext}?"], lazy(() => import("./lib/handle_route_md.tsx"))),
  byPattern("/blog/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/blog", lazy(() => import("./lib/handle_route_md.tsx"))),
  byPattern("/async", lazy(() => import("./routes/async.tsx"))),
  byPattern("/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/", lazy(() => import("./routes/index.tsx"))),
);
