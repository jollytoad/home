// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byMethod } from "@http/route/by-method";
import { byPattern } from "@http/route/by-pattern";
import { cascade } from "@http/route/cascade";
import { lazy } from "@http/route/lazy";
import { handleComponent } from "./lib/handle_component.tsx";

export default cascade(
  byPattern(
    ":pre(/auto-refresh/):path+.js",
    lazy(async () =>
      byMethod(await import("./lib/handle_route_browser_dir.ts"))
    ),
  ),
  byPattern(
    "/todo/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/todo/:listId/:itemId",
    lazy(async () =>
      byMethod(await import("./routes/todo/[listId]/[itemId].tsx"))
    ),
  ),
  byPattern(
    "/todo/:listId",
    lazy(async () =>
      byMethod(await import("./routes/todo/[listId]/index.tsx"))
    ),
  ),
  byPattern(
    "/todo",
    lazy(async () => byMethod(await import("./routes/todo/index.ts"))),
  ),
  byPattern(
    "/tabs",
    lazy(async () =>
      handleComponent((await import("./routes/tabs.tsx")).TabsExample)
    ),
  ),
  byPattern(
    "/sse/stop",
    lazy(async () => (await import("./routes/sse/stop.tsx")).default),
  ),
  byPattern(
    "/sse/start",
    lazy(async () => (await import("./routes/sse/start.tsx")).default),
  ),
  byPattern(
    "/sse/feed",
    lazy(async () => (await import("./routes/sse/feed.tsx")).default),
  ),
  byPattern(
    "/sse",
    lazy(async () => (await import("./routes/sse/index.tsx")).default),
  ),
  byPattern(
    "/sleep",
    lazy(async () => (await import("./routes/sleep.ts")).default),
  ),
  byPattern(
    "/quote/tv",
    lazy(async () => (await import("./routes/quote/tv.ts")).default),
  ),
  byPattern(
    "/quote/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/quote",
    lazy(async () => (await import("./routes/quote/index.tsx")).default),
  ),
  byPattern(
    "/quiz/answer/:id/:answer",
    lazy(async () =>
      (await import("./routes/quiz/answer/[id]/[answer].tsx")).default
    ),
  ),
  byPattern(
    "/quiz/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/quiz",
    lazy(async () => (await import("./routes/quiz/index.tsx")).default),
  ),
  byPattern(
    "/ex/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/ex/:from/:to",
    lazy(async () => (await import("./routes/ex/[from]/[to].tsx")).default),
  ),
  byPattern(
    "/ex",
    lazy(async () => (await import("./routes/ex/index.tsx")).default),
  ),
  byPattern(
    "/calc/eval",
    lazy(async () => (await import("./routes/calc/eval.tsx")).default),
  ),
  byPattern(
    "/calc/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/calc",
    lazy(async () => (await import("./routes/calc/index.tsx")).default),
  ),
  byPattern([
    "/blog/md{.:ext}?",
    "/blog/links{.:ext}?",
    "/blog/jsx_streaming{.:ext}?",
    "/blog/http_getting_started{.:ext}?",
    "/blog/http_fns{.:ext}?",
    "/blog/dependency_hell{.:ext}?",
    "/blog/blogs{.:ext}?",
  ], lazy(async () => byMethod(await import("./lib/handle_route_md.tsx")))),
  byPattern(
    "/blog/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/auto-refresh/feed",
    lazy(async () => byMethod(await import("./routes/auto-refresh/feed.ts"))),
  ),
  byPattern(
    "/async",
    lazy(async () =>
      handleComponent(
        (await import("./routes/async.tsx")).AsyncStreamingExample,
      )
    ),
  ),
  byPattern(
    "/:path+",
    lazy(async () =>
      (await import("./lib/handle_route_static_dir.ts")).default
    ),
  ),
  byPattern(
    "/",
    lazy(async () =>
      handleComponent((await import("./routes/index.tsx")).Home)
    ),
  ),
);
