# Useful functions for a HTTP server

I've always considered HTTP to be a function, Request in, Response out.

I've never really warmed to the way Node frameworks such as Express, Koa, and
henceforth Oak deal with it via middleware routers.

I don't see the need to create an Application or Router object and start
registering routes, when you could just compose functions.

The Deno [HTTP server][serve] takes a simple [Request] -> [Response] [handler]
function, so why not embrace this and compose your handler from more functions.

[serve]: https://deno.land/manual/runtime/http_server_apis
[Request]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[handler]: https://deno.land/api?s=Deno.ServeHandler

I started building up some simple functions to handle routing, and it eventually
grew into quite a collection. All functions exist in their own module, so you
only import the features you actually need.

The library can be found at: https://deno.land/x/http_fns

## Server

First, a quick reminder of the basic Deno Hello World server...

```ts
Deno.serve((_req: Request) => {
  return new Response("Hello World");
});
```

You can copy and paste this, and all later examples directly into the Deno
[REPL] and have a running server at http://localhost:8000.

[REPL]: https://deno.land/manual/tools/repl

## URLPattern matching

First thing we usually need to do is select a handler based upon the URL path,
or seeing as Deno provides us with the standard [URLPattern], we'll make use of
that.

[URLPattern]: https://developer.mozilla.org/en-US/docs/Web/API/URLPattern

```ts
import { byPattern } from "https://deno.land/x/http_fns/pattern.ts";
import { withFallback } from "https://deno.land/x/http_fns/fallback.ts";

Deno.serve(withFallback(
  byPattern("/:path*", (_req, match) => {
    return new Response(`You are at ${match.pathname.groups.path}`);
  }),
));
```

I'll come to `withFallback` in a minute, but first we'll look at `byPattern`.

### [byPattern](https://deno.land/x/http_fns/pattern.ts?s=byPattern)

```ts
function byPattern(pattern, handler): Handler;
```

This takes a route pattern as the first arg, which may be:

- a plain `string`, which will just attempt to match the path of the URL,
- a [URLPatternInit], the input object to `new URLPattern(...)`
- a pre-constructed [URLPattern]
- or an array of any of these, to match multiple routes with one handler

[URLPatternInit]: https://deno.land/api?s=URLPatternInit

> NOTE: a plain `string` is the equivalent of
> `new URLPattern({ pathname: ... }))`, rather than `new URLPattern(...)`, which
> matches the entire URL which is generally not what you want required.

`byPattern` returns a Request handler that attempts to match the Request URL
against the given route pattern.

If it matches, the handler passed in the second arg of `byPattern` is called, if
it doesn't then `null` is returned to indicate handling has been skipped.

## Skipping/Delegated handling

This 'skipping' concept extends the standard Deno handler contract, but it's
what will allow us to compose handlers and delegate handling.

In an ideal world this skip indicator would be represented by a new type or
symbol, but JS being what it is, `null` is a reasonable pragmatic choice. It
means you have to explicitly skip by returning `null`, and not just an implicit
`undefined`.

But, Deno.serve will error if the handler returns `null`, and so we lead neatly
into `withFallback`.

Which, you guessed it, returns a guaranteed fallback Response, should the given
handler return a `null`.

### [withFallback](https://deno.land/x/http_fns/fallback.ts?s=withFallback)

```ts
function withFallback(primaryHandler, fallbackHandler?): Handler;
```

`withFallback` returns a Request handler, that will first call the
`primaryHandler`, if that skips, it will then call `fallbackHandler`, that MUST
return a Response (it cannot skip). The default `fallbackHandler` returns a
`404 Not Found` response.

## Cascading handlers

We'll probably want to handle multiple routes with multiple handlers, and as we
have the ability for a handler skip, we can combine several `byPattern` handlers
into a cascading delegation. ie. attempt handler 1, then 2, then 3, etc.

For this we can use `cascade`...

### [cascade](https://deno.land/x/http_fns/cascade.ts?s=cascade)

```ts
function cascade(...handlers): Handler;
```

`cascade` attempts each handler arg in turn until one returns a Response and
doesn't skip, otherwise it will also skip, and so `withFallback` is required to
handle that still.

```ts
import { byPattern } from "https://deno.land/x/http_fns/pattern.ts";
import { withFallback } from "https://deno.land/x/http_fns/fallback.ts";
import { cascade } from "https://deno.land/x/http_fns/cascade.ts";

Deno.serve(withFallback(
  cascade(
    byPattern("/hello", () => {
      return new Response("Hello world");
    }),
    byPattern("/:path*", (_req, match) => {
      return new Response(`You are ${match.pathname.groups.path}`);
    }),
  ),
));
```

## Cascading with fallback shortcut

I found this `cascade`/`withFallback` combination quite common, and so also
provide the `handle` function as a shortcut...

### [handle](https://deno.land/x/http_fns/handle.ts?s=handle)

```ts
function handle(handlers, fallbackHandler?): Handler;
```

The main difference, is that the handlers are passed in an array, to allow a
fallback to be optionally provided.

```ts
import { handle } from "https://deno.land/x/http_fns/handle.ts";
import { byPattern } from "https://deno.land/x/http_fns/pattern.ts";

Deno.serve(handle([
  byPattern("/hello", () => {
    return new Response("Hello world");
  }),
  byPattern("/:path*", (_req, match) => {
    return new Response(`You are ${match.pathname.groups.path}`);
  }),
]));
```

## Method handling

Quite often your routes will only serve a limited set of methods, maybe just a
GET, maybe also a PUT or POST, but you'd probably want to handle those
differently.

You could just switch on the method within the handler, but you may also want to
support HEAD and OPTIONS with grace too, and maybe respond with a
`405 Method Not Allowed` for unsupported methods. This is all common behaviour
that is neatly dealt with by the `byMethod` function.

### [byMethod](https://deno.land/x/http_fns/method.ts?s=byMethod)

```ts
function byMethod(methodHandlers, fallbackHandler?): Handler;
```

The first arg is an object of handler per method.

```ts
import { handle } from "https://deno.land/x/http_fns/handle.ts";
import { byPattern } from "https://deno.land/x/http_fns/pattern.ts";
import { byMethod } from "https://deno.land/x/http_fns/method.ts";

Deno.serve(handle([
  byPattern(
    "/hello",
    byMethod({
      GET: () => {
        return new Response("Hello world");
      },
    }),
  ),
  byPattern(
    "/:path*",
    byMethod({
      GET: (_req, match) => {
        return new Response(`GET from ${match.pathname.groups.path}`);
      },
      PUT: (_req, match) => {
        return new Response(`PUT to ${match.pathname.groups.path}`);
      },
    }),
  ),
]));
```

If a `GET` method handler is provided, then a default `HEAD` handler will also
be derived that calls the GET handler but discards the body of the Response.

Also, a default `OPTIONS` handler is also derived that responds with the
implemented methods.

These defaults can be overridden by explicitly including the methods with
handlers in the object.

The `fallbackHandler` will be called for any method not explicitly given or
implicitly derived, this defaults a `405 Method Not Allowed`.

## Media Type variants

Another common pattern in serving HTTP, is to provide variant Responses based on
the URL path extension or an `Accept` header.

For example: `/hello.txt`, `/hello.html`, or `Accept: text/plain`,
`Accept: text/html`.

It's common to allow users to explicitly choose a type via a URL extension in a
browser, as well as supporting `Accept` header for browsers or other clients to
declare a set of qualified preferences.

So `byMediaType` supports both at the same time (although extension support is
optional).

### [byMediaType](https://deno.land/x/http_fns/media_type.ts?s=byMediaType)

```ts
function byMediaType(mediaTypeHandlers, fallbackExt?, fallbackAccept?): Handler;
```

```ts
import { handle } from "https://deno.land/x/http_fns/handle.ts";
import { byPattern } from "https://deno.land/x/http_fns/pattern.ts";
import { byMethod } from "https://deno.land/x/http_fns/method.ts";
import { byMediaType } from "https://deno.land/x/http_fns/media_type.ts";

Deno.serve(handle([
  byPattern(
    "/hello{.:ext}?",
    byMethod({
      GET: byMediaType({
        "text/plain": () => {
          return new Response("Hello world");
        },
        "text/html": () => {
          return new Response(
            "<html><body><h1>Hello world</h1></body></html>",
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        },
      }),
    }),
  ),
]));
```

Try hitting the following URLs:

- http://localhost:8000/hello
- http://localhost:8000/hello.html
- http://localhost:8000/hello.txt
- http://localhost:8000/hello.js

Extension support is optional and enabled only if a path group of the URLPattern
is named `ext`, so you'll generally want to add `{.:ext}` (extension is
required) or `{.:ext}?` (extension is optional) to the end of your route
pattern.

The handlers are indexed by the usual two-part media type identifier.

It uses [typeByExtension] to link the matched `:ext` to the media-type, and
[accepts] to determine the most appropriate handler from an `Accept` header.

An explicit extension will always override the `Accept` header.

[typesByExtension]: https://deno.land/std/media_types/type_by_extension.ts?s=typeByExtension
[accepts]: https://deno.land/std/http/negotiation.ts?s=accepts

## And there's more...

I'll leave it here for now, but there are a lot more functions in the library,
including:

- [Response shortcuts](https://deno.land/x/http_fns/response.ts)
- [Request helpers](https://deno.land/x/http_fns/request.ts)
- [Interceptors](https://deno.land/x/http_fns/intercept.ts) (aspect oriented
  middleware)
- [CORS support](https://deno.land/x/http_fns/cors.ts?s=cors)
- [Logging](https://deno.land/x/http_fns/logger.ts)
- [Lazy module loading handler](https://deno.land/x/http_fns/lazy.ts?s=lazy)
- Filesystem based routing, including static
  [code generation](https://deno.land/x/http_fns/generate.ts?s=generateRoutesModule),
  and [dynamic routing](https://deno.land/x/http_fns/dynamic.ts?s=dynamicRoute)
- [Static file serving](https://deno.land/x/http_fns/static.ts?s=staticRoute)
- [Data argument mapping](https://deno.land/x/http_fns/map.ts?s=mapData)
- [Content rendering](https://deno.land/x/http_render_fns) (in a separate
  library)

All of these are based on simple Request -> Response (possibly skipping)
functions, and could therefore be mixed with any other server framework that you
want.
