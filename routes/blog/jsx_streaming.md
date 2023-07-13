# JSX Streaming

TLDR; This is about using JSX as an async streaming template language in Deno,
and has very little to do with React.

## Introduction

I quite like [JSX] as templating language, it's almost identical to HTML, with a
few caveats and slightly stricter semantics (more akin to XHTML) and simply
makes use of JS/TS for all logic. So it's very familiar and saves having to
learn new syntax, esp if you put aside all of the [React] specific
peculiarities. (I remember the days of [E4X])

[JSX]: https://facebook.github.io/jsx
[React]: https://react.dev
[E4X]: https://en.wikipedia.org/wiki/ECMAScript_for_XML

## Experiments

Following the release of [Fresh] I started to make use of [Preact] as my JSX
runtime for server-side rendering, but I felt I didn't need the entire
React-like feature set that came with it. I wanted to just make use of JSX as a
template language, and ideally streaming the output. So I started experimenting
using [Hastscript] as the runtime, but unfortunately it didn't stream either.

[Fresh]: https://fresh.deno.dev
[Preact]: https://preactjs.com
[Hastscript]: https://github.com/syntax-tree/hastscript

I started to think about how I could strip the runtime back to the bare
essentials necessary for server-side rendering.

## Synchronous Streaming

What if, the `jsx` function was a generator function, emitting an `Iterable` of
strings, along the lines of...

(NOTE: This is very simplified, unsafe code, just to demonstrate the concept)

```ts
export function* jsx(type: any, props: any): Iterable<string> {

  if (typeof type === "function") {

    // Call the function component and yield it's strings
    yield* type(props);

  } else if (typeof type === "string") {

    // A html element
    // render and yield the opening tag
    const attrs = /* ... build attrs string ... */;
    yield `<${type} ${attrs}>`;

    // Yield all it's children
    yield* props.children;

    // Yield the closing tag
    yield `</${type}>`;

  } else if (type === null) {

    // A fragment, just yield all the children
    yield* props.children;

  }
}
```

Along with a serializing function to convert that into a [ReadableStream] which
can be returned as the body of a [Response].

[ReadableStream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response

This still required a two-stage request handling, similar to Fresh, where you
have to do all your async work before starting to render. This can become tricky
if you need to supply data to many components.

```tsx
async function handler(req: Request): Promise<Response> {
  // Stage 1: fetch data asynchronously
  const name = await fetchMyName(req);

  // Stage 2: render
  const element = <MyName name={name} />;
  const stream = renderBody(element);
  return new Response(stream);
}

function MyName({ name }: { name: string }) {
  return <div>My name is: {name}</div>;
}
```

I've always wondered why components can't just be asynchronous, and it turns
out, there is nothing preventing a JSX runtime handling async components.

## Asynchronous Streaming

What if, as well as emitting an synchronous `Iterable`, the `jsx` function could
emit an `AsyncIterable` of strings, this not only allows a JSX component to be
an [async function][async_fn], returning a `Promise`, but also to be an
[async generator][async_gen], returning a `AsyncIterable` too.

[async_fn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[async_gen]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*

Now any component can perform whatever async task it needs to obtain it's data,
including async streaming of data and elements.

And not a [hook][useEffect] in sight.

[useEffect]: https://react.dev/reference/react/useEffect

```tsx
function handler(req: Request): Response {
  // Single-stage: just render it
  const element = <MyName req={req} />;
  const stream = renderBody(element);
  return new Response(stream);
}

async function MyName({ req }: { req: Request }) {
  const name = await fetchMyName(req);

  return <div>My name is: {name}</div>;
}
```

NOTE: The handler doesn't even need to be async.

Async components allows the HTML to be streamed almost immediately, without
having to wait for all of the first stage async stuff to complete. But, it also
means that the stream will block as soon as it hits the first async component.

## Deferred Streaming

What if we could skip over slow blocking components, deferring their stream
until later, allowing faster and sync components to continue streaming their
content?

We could drop a placeholder with a unique id into the stream, and later render
the content once ready with a script to substitute it over the placeholder, and
do this all within the same streamed response.

So given a top-level component like this...

```tsx
function Page(req: Request) {
  return (
    <body>
      <h1>Hello</h1>

      <MyName req={req} />

      <p>This is not blocked</p>
    </body>
  );
}
```

A placeholder would be rendered something like this...

```html
<body>
  <h1>Hello</h1>

  <span id="deferred_1"></span>

  <p>This is not blocked</p>
</body>
```

Then later in the same stream, once the component has resolved...

```html
<template id="_deferred_1">
  <div>My name is: Mark</div>
</template>
<script>document.getElementById("deferred_1").outerHTML = document.getElementById("_deferred_1").innerHTML;</script>
```

NOTE: It doesn't matter that the template and script are rendered outside of the
body or html element, the HTML5 parser in every browser is designed to handle
this gracefully and move it into the body within the parsed DOM.

## Examples

The [JSX streaming module][jsx_stream] does all of this, and this site includes
a couple of pages that demonstrate the async streaming and deferral of slow
components (albeit they are somewhat exaggerated).

[jsx_stream]: https://deno.land/x/jsx_stream

- [Quiz](/quiz)

This async [component][quiz_tsx] fetches a question from [The Trivia API][api],
then renders the question and each option with a slight delay, to give the
effect of them being revealed one at a time, without blocking the rendering of
the rest of the page.

[quiz_tsx]: https://github.com/jollytoad/home/blob/main/components/Quiz.tsx
[api]: https://the-trivia-api.com/

- [Async example](/async)

This [page][async_tsx] demonstrates the [`Delayed`][delayed_tsx] async component
to delay the rendering of three blocks of text using a promise, and the
[`Trickled`][trickled_tsx] component which is a async generator component, that
introduces a delay before each child is rendered.

Take a look at the raw source of the page in the browser, and the DOM in the
browser dev tools.

[async_tsx]: https://github.com/jollytoad/home/blob/main/routes/async.tsx
[delayed_tsx]: https://github.com/jollytoad/home/blob/main/components/Delayed.tsx
[trickled_tsx]: https://github.com/jollytoad/home/blob/main/components/Trickled.tsx

- Blog

Even this blog makes use of an async [`Markdown`][markdown_tsx] component that
fetches the raw markdown before converting to HTML. Unfortunately the parsing of
markdown itself isn't streamed yet, but it's something I'd like to do in the
future.

[markdown_tsx]: https://github.com/jollytoad/home/blob/main/components/Markdown.tsx

## Deno Module

[jsx_stream] is available as a Deno module, you can find the source on
[GitHub][src].

NOTE: It's still fairly experimental, lacking docs, and hasn't been tested for
many edge cases, but it does power this website.

[src]: https://github.com/jollytoad/deno_jsx_stream
