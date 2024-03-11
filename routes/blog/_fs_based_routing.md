# File System based Routing

Many frameworks (Fresh included) support a filesystem based routing convention,
generally though you need to go all in on these frameworks to take advantage of
it.

I think Fresh is a great framework, but it doesn't quite fit what I'm doing atm,
I don't need islands, or tailwind for example, but I do want it's filesystem
routing convention.

## Initial approach

My initial approach was to write script that scanned a folder, and generated a
module with code using my [http_fns], so given the files:

- `/routes/quiz`
- `/routes/answer/:id/:answer.tsx`

I'd get a module something like this:

```ts
import { byPattern } from "@http/fns/by_pattern";
import { cascade } from "@http/fns/cascade";
import route_1 from "./routes/quiz.tsx";
import route_2 from "./routes/answer/:id/:answer.tsx";

export default cascade(
  byPattern("/quiz", route_1),
  byPattern("/answer/:id/:answer", route_2),
);
```

Which I could then import and combine in a server:

```ts
import routes from "./routes.ts";
import { withFallback } from "@http/fns/with_fallback";

Deno.serve(withFallback(routes));
```

But, I also wanted additional features such as:

- Runtime discovery
- Dynamic module loading
- Alternative syntax (so I could emulate Fresh for example:
  `/answer/[id]/[answer].tsx`)
- Discovery and mapping of non-TS files, eg. markdown
- Ignoring certain files

After much experimenting and an eventual complete rewrite, it evolved into a
couple of very flexible modules, one dedicated to generating [http_fns] style
code, and another that performs the actual discovery and mapping in a very
generic manner (which the code generator builds upon).

## Route Discovery and Mapping

First I'll describe the more generic function...

`discoverRoutes(options): Promise<DiscoveredRoute[]>`

```ts
import { discoverRoutes } from "@http/fns/discover_routes";

await discoverRoutes({
  fileRouteUrl: import.meta.resolve("./routes"),
  verbose: true,
});
```

With `verbose` enabled, you'd see something like the following logged to the
console:

```
Found route: /quiz -> file:///.../routes/quiz.tsx
Found route: /answer/:id/:answer -> file:///.../routes/answer/:id/:answer.tsx
```

This is the simplest use case, it assumes the paths are valid URLPatterns, and
produces a direct one to one mapping of route to ts/tsx modules only.

If you want to customize the path format, to support Fresh style naming for
example, you can pass a `PathMapper` function as an option.

```ts
import { discoverRoutes } from "@http/fns/discover_routes";
import freshPathMapper from "@http/fns/fresh/path_mapper";

await discoverRoutes({
  fileRootUrl: import.meta.resolve("../routes"),
  pathMapper: freshPathMapper,
  verbose: true,
});
```

The PathMapper takes and returns a `DiscoveredPath`, an object which includes
the parsed path details along with a path pattern and a potential module URL it
maps to.

The simplest case is where the file is a ts/tsx module and the name is a valid
URLPattern path component.

For example: `/routes/answer/:id/:answer.tsx`, this is an actual route on my
home site, which is part of my Quiz example.

```ts
import { discoverRoutes } from "@http/fns/discover_routes";

const routes = await discoverRoutes();
```

## Route Module Generation

```ts
export default cascade(
  byPattern("/quiz", lazy(() => import("./routes/quiz.tsx"))),
  byPattern(
    "/answer/:id/:answer",
    lazy(() => import("./routes/answer/:id/:answer.tsx")),
  ),
);
```
