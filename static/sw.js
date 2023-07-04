(() => {
  // https://deno.land/x/http_fns@v0.0.15/pattern.ts
  function byPattern(pattern, handler) {
    return async (req, ..._args) => {
      const patterns = Array.isArray(pattern) ? pattern : [pattern];
      const url = new URL(req.url);
      for (const pattern2 of patterns) {
        const match = typeof pattern2 === "string" ? new URLPattern({ pathname: pattern2 }).exec(url) : pattern2 instanceof URLPattern ? pattern2.exec(url) : new URLPattern(pattern2).exec(url);
        if (match) {
          const res = await handler(req, match);
          if (res) {
            return res;
          }
        }
      }
      return null;
    };
  }

  // https://deno.land/x/http_fns@v0.0.15/cascade.ts
  function cascade(...handlers) {
    return async (req, ...args) => {
      for (const handler of handlers) {
        const res = await handler(req, ...args);
        if (res) {
          return res;
        }
      }
      return null;
    };
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/defer.ts
  function defaultPlaceholder(id) {
    return `<span id="${id}"></span>`;
  }
  async function* defaultSubstitution(id, children) {
    yield `<template id="_${id}">`;
    yield* children;
    yield `</template>`;
    yield `<script>document.getElementById("${id}").outerHTML = document.getElementById("_${id}").innerHTML;<\/script>`;
  }

  // https://deno.land/x/jsx_stream@v0.0.7/guards.ts
  function isPromiseLike(value) {
    return typeof value?.then === "function";
  }
  function isIterable(value) {
    return typeof value !== "string" && typeof value?.[Symbol.iterator] === "function";
  }
  function isAsyncIterable(value) {
    return typeof value?.[Symbol.asyncIterator] === "function";
  }

  // https://deno.land/std@0.192.0/html/entities.ts
  var rawToEntityEntries = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&#39;"]
  ];
  var defaultEntityList = Object.fromEntries([
    ...rawToEntityEntries.map(([raw, entity]) => [entity, raw]),
    ["&apos;", "'"],
    ["&nbsp;", "\xA0"]
  ]);
  var rawToEntity = new Map(rawToEntityEntries);
  var rawRe = new RegExp(`[${[...rawToEntity.keys()].join("")}]`, "g");
  function escape(str) {
    return str.replaceAll(rawRe, (m) => rawToEntity.get(m));
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/safe_string.ts
  var _SafeString = class extends String {
  };
  function safe(value) {
    return new _SafeString(value);
  }
  function escape2(value) {
    return safe(escape(String(value)));
  }
  function isSafe(value) {
    return value instanceof _SafeString;
  }

  // https://deno.land/std@0.192.0/async/delay.ts
  function delay(ms, options = {}) {
    const { signal, persistent } = options;
    if (signal?.aborted) {
      return Promise.reject(new DOMException("Delay was aborted.", "AbortError"));
    }
    return new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(i);
        reject(new DOMException("Delay was aborted.", "AbortError"));
      };
      const done = () => {
        signal?.removeEventListener("abort", abort);
        resolve();
      };
      const i = setTimeout(done, ms);
      signal?.addEventListener("abort", abort, { once: true });
      if (persistent === false) {
        try {
          Deno.unrefTimer(i);
        } catch (error) {
          if (!(error instanceof ReferenceError)) {
            throw error;
          }
          console.error("`persistent` option is only available in Deno");
        }
      }
    });
  }

  // https://deno.land/std@0.192.0/async/deferred.ts
  function deferred() {
    let methods;
    let state = "pending";
    const promise = new Promise((resolve, reject) => {
      methods = {
        async resolve(value) {
          await value;
          state = "fulfilled";
          resolve(value);
        },
        // deno-lint-ignore no-explicit-any
        reject(reason) {
          state = "rejected";
          reject(reason);
        }
      };
    });
    Object.defineProperty(promise, "state", { get: () => state });
    return Object.assign(promise, methods);
  }

  // https://deno.land/std@0.192.0/async/mux_async_iterator.ts
  var MuxAsyncIterator = class {
    #iteratorCount = 0;
    #yields = [];
    // deno-lint-ignore no-explicit-any
    #throws = [];
    #signal = deferred();
    add(iterable) {
      ++this.#iteratorCount;
      this.#callIteratorNext(iterable[Symbol.asyncIterator]());
    }
    async #callIteratorNext(iterator) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          --this.#iteratorCount;
        } else {
          this.#yields.push({ iterator, value });
        }
      } catch (e) {
        this.#throws.push(e);
      }
      this.#signal.resolve();
    }
    async *iterate() {
      while (this.#iteratorCount > 0) {
        await this.#signal;
        for (let i = 0; i < this.#yields.length; i++) {
          const { iterator, value } = this.#yields[i];
          yield value;
          this.#callIteratorNext(iterator);
        }
        if (this.#throws.length) {
          for (const e of this.#throws) {
            throw e;
          }
          this.#throws.length = 0;
        }
        this.#yields.length = 0;
        this.#signal = deferred();
      }
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
  };

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/stream_node.ts
  async function* streamNode(node, options) {
    const deferredTimeout = asSafeInteger(options?.deferredTimeout);
    const streamDelay2 = asSafeInteger(options?.streamDelay);
    const renderPlaceholder = asFunction(options?.deferredPlaceholder) ?? defaultPlaceholder;
    const renderSubstitution = asFunction(options?.deferredSubstitution) ?? defaultSubstitution;
    const deferrals = new MuxAsyncIterator();
    yield* streamNode_(node);
    for await (const deferredStream of deferrals) {
      yield* deferredStream;
    }
    async function* streamNode_(node2) {
      if (isSafe(node2)) {
        yield String(node2);
      } else if (typeof node2 === "string") {
        console.warn("%cWARNING: raw string detected:", "color: red", node2);
      } else if (isPromiseLike(node2)) {
        const awaited = await timeout(node2, deferredTimeout);
        if (awaited) {
          yield* streamNode_(awaited);
        } else {
          yield defer(node2);
        }
      } else if (isIterable(node2)) {
        for (const child of node2) {
          yield* streamNode_(child);
        }
      } else if (isAsyncIterable(node2)) {
        if (deferredTimeout) {
          yield* streamNode_(firstNodeIteration(node2));
        } else {
          for await (const child of node2) {
            yield* streamNode_(child);
          }
        }
      } else if (isNodeIteration(node2)) {
        if (!node2.done) {
          yield* streamNode_(node2.value);
          yield* streamNode_(nextNodeIteration(node2.iterator));
        }
      }
      if (streamDelay2) {
        await delay(streamDelay2);
      }
    }
    function defer(node2) {
      const id = crypto.randomUUID();
      deferrals.add(renderDeferred(id, node2));
      return renderPlaceholder(id);
    }
    async function* renderDeferred(id, deferred2) {
      const node2 = await deferred2;
      yield renderSubstitution(id, streamNode_(node2));
    }
  }
  function asSafeInteger(value) {
    return Number.isSafeInteger(value) ? value : void 0;
  }
  function asFunction(fn) {
    return typeof fn === "function" ? fn : void 0;
  }
  function firstNodeIteration(iterable) {
    return nextNodeIteration(iterable[Symbol.asyncIterator]());
  }
  async function nextNodeIteration(iterator) {
    const result = await iterator.next();
    return {
      ...result,
      iterator
    };
  }
  function isNodeIteration(node) {
    return typeof node?.iterator?.next === "function";
  }
  function timeout(value, deferredTimeout) {
    if (deferredTimeout) {
      return Promise.race([
        value,
        delay(deferredTimeout)
      ]);
    } else {
      return value;
    }
  }

  // https://deno.land/std@0.192.0/streams/readable_stream_from_iterable.ts
  function readableStreamFromIterable(iterable) {
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      async cancel(reason) {
        if (typeof iterator.throw == "function") {
          try {
            await iterator.throw(reason);
          } catch {
          }
        }
      }
    });
  }

  // https://deno.land/x/jsx_stream@v0.0.7/serialize.ts
  function renderBody(node, options) {
    return readableStreamFromIterable(streamNode(node, options)).pipeThrough(
      new TextEncoderStream()
    );
  }

  // https://deno.land/x/http_render_fns@v0.0.4/response.ts
  function ok(body, headers) {
    return new Response(body, {
      status: body ? 200 : 204,
      statusText: body ? "OK" : "No Content",
      headers
    });
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/stream_component.ts
  function streamComponent(component, props) {
    return component(props);
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/awaited_props.ts
  function awaitedProps(props) {
    const promisedEntries = [];
    for (const [name, value] of Object.entries(props)) {
      if (isPromiseLike(value)) {
        promisedEntries.push((async () => [name, await value])());
      }
    }
    if (promisedEntries.length) {
      return Promise.all(promisedEntries).then((entries) => ({
        ...props,
        ...Object.fromEntries(entries)
      }));
    } else {
      return props;
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/stream_fragment.ts
  function* streamFragment(children) {
    if (isSafe(children)) {
      yield children;
    } else if (typeof children === "string" || typeof children === "boolean" || typeof children === "number") {
      yield escape2(children);
    } else if (isPromiseLike(children)) {
      yield children.then(streamFragment);
    } else if (isIterable(children)) {
      for (const child of children) {
        yield* streamFragment(child);
      }
    } else if (isAsyncIterable(children)) {
      yield async function* map(iterable) {
        for await (const node of iterable) {
          yield streamFragment(node);
        }
      }(children);
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/util.ts
  var VOID_ELEMENTS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  function isVoidElement(tag) {
    return VOID_ELEMENTS.has(tag);
  }
  function isValidTag(tag) {
    return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(tag);
  }
  var SPECIAL_ATTRS = /* @__PURE__ */ new Set([
    "dangerouslySetInnerHTML"
  ]);
  function isValidAttr(name, value) {
    return value !== false && value !== void 0 && value !== null && !SPECIAL_ATTRS.has(name) && /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(name);
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/stream_element.ts
  function* streamElement(tag, props) {
    const { children, ...attrs } = props && typeof props === "object" ? props : {};
    const awaitedAttrs = awaitedProps(attrs);
    if (isPromiseLike(awaitedAttrs)) {
      yield awaitedAttrs.then((attrs2) => {
        return streamElement(tag, { children, attrs: attrs2 });
      });
    } else {
      let attrStr = "";
      for (const [name, value] of Object.entries(awaitedAttrs)) {
        if (isValidAttr(name, value)) {
          attrStr += ` ${name}`;
          if (value !== true) {
            attrStr += `="${escape2(value)}"`;
          }
        }
      }
      if (isVoidElement(tag)) {
        yield safe(`<${tag}${attrStr}/>`);
      } else {
        yield safe(`<${tag}${attrStr}>`);
        const __html = awaitedAttrs.dangerouslySetInnerHTML?.__html;
        if (typeof __html === "string") {
          yield safe(__html);
        } else {
          yield* streamFragment(children);
        }
        yield safe(`</${tag}>`);
      }
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.7/_internal/stream_unknown.ts
  async function* streamUnknown(type) {
    console.warn(`Unknown JSX type: ${type}`);
  }

  // https://deno.land/x/jsx_stream@v0.0.7/jsx-runtime.ts
  function jsx(type, props) {
    try {
      if (typeof type === "function") {
        return streamComponent(type, props);
      } else if (type === null) {
        return streamFragment(props.children);
      } else if (isValidTag(type)) {
        return streamElement(type, props);
      } else {
        return streamUnknown(type);
      }
    } finally {
    }
  }

  // https://deno.land/x/http_render_fns@v0.0.4/render_html.tsx
  var DOCTYPE = "<!DOCTYPE html>\n";
  var ENCODED_DOCTYPE = new TextEncoder().encode(DOCTYPE);
  var streamDelay = 0;
  function renderHTML(Component, headers, options) {
    return async (_req, props) => {
      const start = performance.now();
      const vnode = /* @__PURE__ */ jsx(Component, { ...props });
      let bodyInit = await renderBody(vnode, options);
      if (isData(bodyInit)) {
        return ok(bodyInit, headers);
      } else if (isStream(bodyInit)) {
        const reader = bodyInit.getReader();
        bodyInit = new ReadableStream({
          start(controller) {
            controller.enqueue(ENCODED_DOCTYPE);
          },
          async pull(controller) {
            const { value, done } = await reader.read();
            if (done) {
              controller.close();
              logTiming("Stream");
            } else {
              controller.enqueue(value);
              if (streamDelay) {
                await new Promise((resolve) => setTimeout(resolve, streamDelay));
              }
            }
          }
        });
      } else {
        bodyInit = new Blob([
          DOCTYPE,
          bodyInit
        ]);
        logTiming("Blob");
      }
      return ok(bodyInit, {
        "Content-Type": "text/html; charset=utf-8",
        ...headers
      });
      function logTiming(note) {
        const end = performance.now();
        console.debug("Render took:", end - start, "ms", note);
      }
    };
  }
  function isStream(bodyInit) {
    return !!bodyInit && typeof bodyInit === "object" && "getReader" in bodyInit && typeof bodyInit.getReader === "function";
  }
  function isData(bodyInit) {
    return bodyInit instanceof FormData || bodyInit instanceof URLSearchParams;
  }

  // https://deno.land/std@0.192.0/http/http_status.ts
  var STATUS_TEXT = {
    [202 /* Accepted */]: "Accepted",
    [208 /* AlreadyReported */]: "Already Reported",
    [502 /* BadGateway */]: "Bad Gateway",
    [400 /* BadRequest */]: "Bad Request",
    [409 /* Conflict */]: "Conflict",
    [100 /* Continue */]: "Continue",
    [201 /* Created */]: "Created",
    [103 /* EarlyHints */]: "Early Hints",
    [417 /* ExpectationFailed */]: "Expectation Failed",
    [424 /* FailedDependency */]: "Failed Dependency",
    [403 /* Forbidden */]: "Forbidden",
    [302 /* Found */]: "Found",
    [504 /* GatewayTimeout */]: "Gateway Timeout",
    [410 /* Gone */]: "Gone",
    [505 /* HTTPVersionNotSupported */]: "HTTP Version Not Supported",
    [226 /* IMUsed */]: "IM Used",
    [507 /* InsufficientStorage */]: "Insufficient Storage",
    [500 /* InternalServerError */]: "Internal Server Error",
    [411 /* LengthRequired */]: "Length Required",
    [423 /* Locked */]: "Locked",
    [508 /* LoopDetected */]: "Loop Detected",
    [405 /* MethodNotAllowed */]: "Method Not Allowed",
    [421 /* MisdirectedRequest */]: "Misdirected Request",
    [301 /* MovedPermanently */]: "Moved Permanently",
    [207 /* MultiStatus */]: "Multi Status",
    [300 /* MultipleChoices */]: "Multiple Choices",
    [511 /* NetworkAuthenticationRequired */]: "Network Authentication Required",
    [204 /* NoContent */]: "No Content",
    [203 /* NonAuthoritativeInfo */]: "Non Authoritative Info",
    [406 /* NotAcceptable */]: "Not Acceptable",
    [510 /* NotExtended */]: "Not Extended",
    [404 /* NotFound */]: "Not Found",
    [501 /* NotImplemented */]: "Not Implemented",
    [304 /* NotModified */]: "Not Modified",
    [200 /* OK */]: "OK",
    [206 /* PartialContent */]: "Partial Content",
    [402 /* PaymentRequired */]: "Payment Required",
    [308 /* PermanentRedirect */]: "Permanent Redirect",
    [412 /* PreconditionFailed */]: "Precondition Failed",
    [428 /* PreconditionRequired */]: "Precondition Required",
    [102 /* Processing */]: "Processing",
    [407 /* ProxyAuthRequired */]: "Proxy Auth Required",
    [413 /* RequestEntityTooLarge */]: "Request Entity Too Large",
    [431 /* RequestHeaderFieldsTooLarge */]: "Request Header Fields Too Large",
    [408 /* RequestTimeout */]: "Request Timeout",
    [414 /* RequestURITooLong */]: "Request URI Too Long",
    [416 /* RequestedRangeNotSatisfiable */]: "Requested Range Not Satisfiable",
    [205 /* ResetContent */]: "Reset Content",
    [303 /* SeeOther */]: "See Other",
    [503 /* ServiceUnavailable */]: "Service Unavailable",
    [101 /* SwitchingProtocols */]: "Switching Protocols",
    [418 /* Teapot */]: "I'm a teapot",
    [307 /* TemporaryRedirect */]: "Temporary Redirect",
    [425 /* TooEarly */]: "Too Early",
    [429 /* TooManyRequests */]: "Too Many Requests",
    [401 /* Unauthorized */]: "Unauthorized",
    [451 /* UnavailableForLegalReasons */]: "Unavailable For Legal Reasons",
    [422 /* UnprocessableEntity */]: "Unprocessable Entity",
    [415 /* UnsupportedMediaType */]: "Unsupported Media Type",
    [426 /* UpgradeRequired */]: "Upgrade Required",
    [305 /* UseProxy */]: "Use Proxy",
    [506 /* VariantAlsoNegotiates */]: "Variant Also Negotiates"
  };

  // https://deno.land/x/http_fns@v0.0.15/response.ts
  function response(status, body, headers) {
    return new Response(body, {
      status,
      statusText: STATUS_TEXT[status],
      headers
    });
  }
  function errorResponse(message, status = 400 /* BadRequest */) {
    return response(status, message ?? STATUS_TEXT[status], {
      "Content-Type": "text/plain"
    });
  }
  function methodNotAllowed() {
    return errorResponse(null, 405 /* MethodNotAllowed */);
  }

  // https://deno.land/x/http_fns@v0.0.15/method.ts
  function byMethod(handlers, fallback = () => methodNotAllowed()) {
    const defaultHandlers = {
      OPTIONS: optionsHandler(handlers)
    };
    if (handlers.GET) {
      defaultHandlers.HEAD = headHandler(handlers.GET);
    }
    return (req, ...args) => {
      const method = req.method;
      const handler = handlers[method] ?? defaultHandlers[method];
      if (handler) {
        return handler(req, ...args);
      }
      return fallback(req, ...args);
    };
  }
  function optionsHandler(handlers) {
    const methods = Object.keys(handlers);
    if ("GET" in methods && !("HEAD" in methods)) {
      methods.push("HEAD");
    }
    if (!("OPTIONS" in methods)) {
      methods.push("OPTIONS");
    }
    const allow = methods.join(", ");
    return () => {
      return new Response(null, {
        headers: {
          allow
        }
      });
    };
  }
  var headHandler = (handler) => async (req, ...args) => {
    const response2 = await handler(req, ...args);
    return response2 ? new Response(null, response2) : response2;
  };

  // https://deno.land/x/http_fns@v0.0.15/map.ts
  function mapData(mapper, handler) {
    return async (req, data) => handler(req, await mapper(req, data));
  }

  // config.ts
  var FRAGMENT_RENDER_OPTIONS = {
    deferredTimeout: false
  };

  // lib/route.ts
  function asRouteProps(req, match) {
    return { req, match };
  }
  function handleFragment(Component, headers) {
    return byMethod({
      GET: mapData(
        asRouteProps,
        renderHTML(Component, headers, FRAGMENT_RENDER_OPTIONS)
      )
    });
  }

  // lib/evaluate.js
  function tokenize(input) {
    let scanner = 0;
    const tokens = [];
    while (scanner < input.length) {
      const char = input[scanner];
      if (/[0-9]/.test(char)) {
        let digits = "";
        while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
          digits += input[scanner++];
        }
        const number = parseFloat(digits);
        tokens.push(number);
        continue;
      }
      if (/[+\-/*()^]/.test(char)) {
        tokens.push(char);
        scanner++;
        continue;
      }
      if (char === " ") {
        scanner++;
        continue;
      }
      throw new Error(`Invalid token ${char} at position ${scanner}`);
    }
    return tokens;
  }
  function toRPN(tokens) {
    const operators = [];
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === "number") {
        out.push(token);
        continue;
      }
      if (/[+\-/*<>=^]/.test(token)) {
        while (shouldUnwindOperatorStack(operators, token)) {
          out.push(operators.pop());
        }
        operators.push(token);
        continue;
      }
      if (token === "(") {
        operators.push(token);
        continue;
      }
      if (token === ")") {
        while (operators.length > 0 && operators[operators.length - 1] !== "(") {
          out.push(operators.pop());
        }
        operators.pop();
        continue;
      }
      throw new Error(`Unparsed token ${token} at position ${i}`);
    }
    for (let i = operators.length - 1; i >= 0; i--) {
      out.push(operators[i]);
    }
    return out;
  }
  var precedence = { "^": 3, "*": 2, "/": 2, "+": 1, "-": 1 };
  function shouldUnwindOperatorStack(operators, nextToken) {
    if (operators.length === 0) {
      return false;
    }
    const lastOperator = operators[operators.length - 1];
    return precedence[lastOperator] >= precedence[nextToken];
  }
  function evalRPN(rpn) {
    const stack = [];
    for (let i = 0; i < rpn.length; i++) {
      const token = rpn[i];
      if (/[+\-/*^]/.test(token)) {
        stack.push(operate(token, stack));
        continue;
      }
      stack.push(token);
    }
    return stack.pop();
  }
  function operate(operator, stack) {
    const a = stack.pop();
    const b = stack.pop();
    switch (operator) {
      case "+":
        return b + a;
      case "-":
        return b - a;
      case "*":
        return b * a;
      case "/":
        return b / a;
      case "^":
        return Math.pow(b, a);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
  function evaluate(input) {
    return evalRPN(toRPN(tokenize(input)));
  }

  // https://deno.land/x/http_fns@v0.0.15/request.ts
  function getSearchValues(input) {
    const searchParams = input instanceof Request ? new URL(input.url).searchParams : input instanceof URL ? input.searchParams : input instanceof URLSearchParams ? input : input && "search" in input && "input" in input.search ? new URLSearchParams(input.search.input) : void 0;
    return (param, separator) => {
      return searchParams ? separator ? searchParams.getAll(param).join(separator).split(separator).filter(
        (v) => v !== ""
      ) : searchParams.getAll(param) : [];
    };
  }

  // components/Evaluate.tsx
  async function Evaluate({ expr }) {
    if (expr) {
      console.log("Calculating...", expr);
      await delay(1);
      try {
        const result = evaluate(expr);
        console.log("The answer is:", result);
        if (!Number.isNaN(result)) {
          return /* @__PURE__ */ jsx("output", { class: "result", id: "result", children: result });
        }
      } catch (e) {
        console.error(e);
      }
      return /* @__PURE__ */ jsx("output", { class: "error", id: "result", children: "Error" });
    } else {
      return /* @__PURE__ */ jsx("output", { class: "blank", id: "result", children: "\xA0" });
    }
  }
  function evaluatePropsFrom(req) {
    return {
      expr: req && getSearchValues(req)("expr")[0] || ""
    };
  }

  // routes/calc/eval.tsx
  var eval_default = handleFragment(({ req }) => {
    return /* @__PURE__ */ jsx(Evaluate, { ...evaluatePropsFrom(req) });
  });

  // service_worker/routes.ts
  var routes_default = cascade(
    byPattern("/calc/eval", eval_default)
  );

  // service_worker/sw.js
  console.log("SERVICE WORKER");
  self.addEventListener("fetch", async (event) => {
    console.log("FETCH");
    const response2 = await routes_default(event.request);
    if (response2) {
      event.respondWith(response2);
    }
  });
})();
