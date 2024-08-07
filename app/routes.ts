// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byMethod } from "@http/route/by-method";
import { byPattern } from "@http/route/by-pattern";
import { cascade } from "@http/route/cascade";
import { lazy } from "@http/route/lazy";
import { handleComponent } from "./lib/handle_component.tsx";

export default cascade(
  byPattern(
    ":pre(/auto-refresh/):path+.js",
    lazy(async () => byMethod(await import("./lib/handle_route_browser_dir.ts"))),
  ),
  byPattern("/todo/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/todo/:listId/:itemId", lazy(async () => byMethod(await import("./routes/todo/[listId]/[itemId].tsx")))),
  byPattern("/todo/:listId", lazy(async () => byMethod(await import("./routes/todo/[listId]/index.tsx")))),
  byPattern("/todo", lazy(async () => byMethod(await import("./routes/todo/index.ts")))),
  byPattern(
    "/tabs",
    lazy(async () => handleComponent((await import("./routes/tabs.tsx")).TabsExample, "./app/routes/tabs.tsx")),
  ),
  byPattern("/sse/stop", lazy(() => import("./routes/sse/stop.tsx"))),
  byPattern("/sse/start", lazy(() => import("./routes/sse/start.tsx"))),
  byPattern("/sse/feed", lazy(() => import("./routes/sse/feed.tsx"))),
  byPattern("/sse", lazy(() => import("./routes/sse/index.tsx"))),
  byPattern("/sleep", lazy(() => import("./routes/sleep.ts"))),
  byPattern("/quote/tv", lazy(() => import("./routes/quote/tv.ts"))),
  byPattern("/quote/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/quote", lazy(() => import("./routes/quote/index.tsx"))),
  byPattern("/quiz/answer/:id/:answer", lazy(() => import("./routes/quiz/answer/[id]/[answer].tsx"))),
  byPattern("/quiz/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/quiz", lazy(() => import("./routes/quiz/index.tsx"))),
  byPattern("/ex/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/ex/:from/:to", lazy(() => import("./routes/ex/[from]/[to].tsx"))),
  byPattern("/ex", lazy(() => import("./routes/ex/index.tsx"))),
  byPattern("/calc/eval", lazy(() => import("./routes/calc/eval.tsx"))),
  byPattern("/calc/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/calc", lazy(() => import("./routes/calc/index.tsx"))),
  byPattern([
    "/blog/md{.:ext}?",
    "/blog/links{.:ext}?",
    "/blog/jsx_streaming{.:ext}?",
    "/blog/http_getting_started{.:ext}?",
    "/blog/http_fns{.:ext}?",
    "/blog/dependency_hell{.:ext}?",
    "/blog/blogs{.:ext}?",
  ], lazy(async () => byMethod(await import("./lib/handle_route_md.tsx")))),
  byPattern("/blog/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern("/auto-refresh/feed", lazy(async () => byMethod(await import("./routes/auto-refresh/feed.ts")))),
  byPattern(
    "/async",
    lazy(async () =>
      handleComponent((await import("./routes/async.tsx")).AsyncStreamingExample, "./app/routes/async.tsx")
    ),
  ),
  byPattern("/:path+", lazy(() => import("./lib/handle_route_static_dir.ts"))),
  byPattern(
    "/",
    lazy(async () => handleComponent((await import("./routes/index.tsx")).Home, "./app/routes/index.tsx")),
  ),
);
