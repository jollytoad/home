(() => {
  // https://jsr.io/@http/route/0.9.0-beta.3/as_url_pattern.ts
  function asURLPattern(pattern) {
    return typeof pattern === "string" ? new URLPattern({ pathname: pattern }) : pattern instanceof URLPattern ? pattern : new URLPattern(pattern);
  }
  function asURLPatterns(pattern) {
    return Array.isArray(pattern) ? pattern.map(asURLPattern) : [asURLPattern(pattern)];
  }

  // https://jsr.io/@http/route/0.9.0-beta.3/by_pattern.ts
  function byPattern(pattern, handler) {
    const patterns = asURLPatterns(pattern);
    return async (req, ...args) => {
      for (const pattern2 of patterns) {
        const match = pattern2.exec(req.url);
        if (match) {
          const res = await handler(req, match, ...args);
          if (res) {
            return res;
          }
        }
      }
      return null;
    };
  }

  // https://jsr.io/@http/route/0.9.0-beta.3/cascade.ts
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

  // https://jsr.io/@http/response/0.9.0-beta.3/plain_error.ts
  function plainError(status, statusText, message) {
    return new Response(message ?? statusText, {
      status,
      statusText,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  // https://jsr.io/@http/response/0.9.0-beta.3/method_not_allowed.ts
  function methodNotAllowed(message) {
    return plainError(405, "Method Not Allowed", message);
  }

  // https://jsr.io/@http/response/0.9.0-beta.3/no_content.ts
  function noContent(headers) {
    return new Response(null, {
      status: 204,
      statusText: "No Content",
      headers
    });
  }

  // https://jsr.io/@http/response/0.9.0-beta.3/replace_body.ts
  function replaceBody(res, body) {
    return res.body === body ? res : new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  }

  // https://jsr.io/@http/route/0.9.0-beta.3/by_method.ts
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
    if ("GET" in handlers && !("HEAD" in handlers)) {
      methods.push("HEAD");
    }
    if (!("OPTIONS" in handlers)) {
      methods.push("OPTIONS");
    }
    const allow = methods.join(", ");
    return () => noContent({ allow });
  }
  var headHandler = (handler) => async (req, ...args) => {
    const response = await handler(req, ...args);
    return response ? replaceBody(response, null) : response;
  };

  // config_fragment.ts
  var FRAGMENT_RENDER_OPTIONS = {
    deferredTimeout: false
  };

  // https://jsr.io/@http/response/0.9.0-beta.3/html.ts
  function html(body, headersInit) {
    const headers = new Headers(headersInit);
    headers.set("Content-Type", "text/html");
    return new Response(body, {
      status: 200,
      statusText: "OK",
      headers
    });
  }

  // https://jsr.io/@http/response/0.9.0-beta.3/prepend_doctype.ts
  var DOCTYPE = "<!DOCTYPE html>\n";
  var ENCODED_DOCTYPE = new TextEncoder().encode(DOCTYPE);
  function prependDocType(bodyInit) {
    if (isData(bodyInit)) {
      return bodyInit;
    } else if (isStream(bodyInit)) {
      const reader = bodyInit.getReader();
      return new ReadableStream({
        start(controller) {
          controller.enqueue(ENCODED_DOCTYPE);
        },
        async pull(controller) {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        }
      });
    } else {
      return new Blob([
        DOCTYPE,
        bodyInit
      ]);
    }
  }
  function isStream(bodyInit) {
    return !!bodyInit && typeof bodyInit === "object" && "getReader" in bodyInit && typeof bodyInit.getReader === "function";
  }
  function isData(bodyInit) {
    return bodyInit instanceof FormData || bodyInit instanceof URLSearchParams;
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/readable_stream_from_iterable.ts
  function readableStreamFromIterable(iterable) {
    if ("from" in ReadableStream && typeof ReadableStream.from === "function") {
      return ReadableStream.from(iterable);
    }
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

  // https://jsr.io/@http/jsx-stream/0.1.1/guards.ts
  function isPrimitiveValue(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
  }
  function isPromiseLike(value) {
    return typeof value?.then === "function";
  }
  function isIterable(value) {
    return typeof value !== "string" && typeof value?.[Symbol.iterator] === "function";
  }
  function isAsyncIterable(value) {
    return typeof value?.[Symbol.asyncIterator] === "function";
  }

  // https://jsr.io/@std/html/0.219.1/entities.ts
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

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/util.ts
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
    return value !== false && value !== void 0 && value !== null && !SPECIAL_ATTRS.has(name) && // deno-lint-ignore no-control-regex
    /^[^\u0000-\u001F\u007F-\u009F\s"'>/=\uFDD0-\uFDEF\p{NChar}]+$/u.test(name);
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/token.ts
  var _Token = class extends String {
    kind;
    tagName;
    attributes;
  };
  function safe(value) {
    return new _Token(value);
  }
  function escape2(value) {
    return safe(escape(String(value)));
  }
  function openTag(tagName, attrs) {
    return _tag(tagName, attrs, "open");
  }
  function voidTag(tagName, attrs) {
    return _tag(tagName, attrs, "void", "/");
  }
  function closeTag(tagName) {
    const token = new _Token(`</${tagName}>`);
    token.kind = "close";
    token.tagName = tagName;
    return token;
  }
  function isSafe(value) {
    return value instanceof _Token;
  }
  function isTag(value, kind) {
    return value instanceof _Token && !!value.kind && !!value.tagName && (kind ? value.kind === kind : true);
  }
  function _tag(tagName, attributes, kind, close = "") {
    let attrStr = "";
    for (const [name, value] of Object.entries(attributes)) {
      if (isValidAttr(name, value)) {
        attrStr += ` ${name}`;
        if (value !== true) {
          attrStr += `="${escape2(value)}"`;
        }
      }
    }
    const token = new _Token(`<${tagName}${attrStr}${close}>`);
    token.kind = kind;
    token.tagName = tagName;
    token.attributes = attributes;
    return token;
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/stream_node_sw.ts
  async function* streamNode(node, options) {
    const tagStack = [];
    const context = {
      scripts: /* @__PURE__ */ new Set(),
      stylesheets: /* @__PURE__ */ new Set()
    };
    yield* streamNode_(node);
    async function* streamNode_(node2) {
      if (isTag(node2, "open")) {
        tagStack.unshift([node2, []]);
        stashTokens(node2);
        yield* applyTagHooks("beforeStart", node2);
        yield String(node2);
        yield* applyTagHooks("afterStart", node2);
      } else if (isTag(node2, "void")) {
        stashTokens(node2);
        yield* applyTagHooks("beforeStart", node2);
        yield String(node2);
        yield* applyTagHooks("afterEnd", node2);
      } else if (isTag(node2, "close")) {
        stashTokens(node2);
        if (!tagStack.length) {
          console.error(
            `%cTag mismatch, closing tag </${node2.tagName}> has no opening tag.`,
            "color: red"
          );
        } else {
          const [[tag, tokens]] = tagStack;
          if (tag.tagName !== node2.tagName) {
            console.error(
              `%cTag mismatch, closing tag </${node2.tagName}> does not match expected opening tag <${tag.tagName}>`,
              "color: red"
            );
          }
          yield* applyTagHooks("beforeEnd", tag, tokens);
          yield String(node2);
          yield* applyTagHooks("afterEnd", tag, tokens);
          tagStack.shift();
        }
      } else if (isSafe(node2)) {
        stashTokens(node2);
        yield String(node2);
      } else if (typeof node2 === "string") {
        console.warn("%cWARNING: raw string detected:", "color: red", node2);
      } else if (isPromiseLike(node2)) {
        yield* streamNode_(await node2);
      } else if (isIterable(node2)) {
        for (const child of node2) {
          yield* streamNode_(child);
        }
      } else if (isAsyncIterable(node2)) {
        for await (const child of node2) {
          yield* streamNode_(child);
        }
      }
    }
    async function* applyTagHooks(place, tag, tokens) {
      const wildcards = tag.tagName.split("-").map(
        (_v, i, a) => [...a.slice(0, i), "*"].join("-")
      ).reverse();
      for (const name of [tag.tagName, ...wildcards]) {
        if (name) {
          const fn = asFunction(options?.tagHandlers?.[name]?.[place]);
          const node2 = fn?.(tag, context, tokens);
          if (node2) {
            yield* streamNode_(node2);
          }
        }
      }
    }
    function stashTokens(token) {
      for (const [tag, tokens] of tagStack) {
        const tagHooks = options?.tagHandlers?.[tag.tagName];
        if (tagHooks?.collectTokens && (tagHooks?.beforeEnd || tagHooks?.afterEnd)) {
          tokens?.push(token);
        }
      }
    }
  }
  function asFunction(fn) {
    return typeof fn === "function" ? fn : void 0;
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/serialize_sw.ts
  function renderBody(node, options) {
    return readableStreamFromIterable(streamNode(node, options)).pipeThrough(
      new TextEncoderStream()
    );
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/stream_component.ts
  function streamComponent(component, props) {
    return component(props);
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/awaited_props.ts
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

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/stream_fragment.ts
  function* streamFragment(children) {
    if (isSafe(children)) {
      yield children;
    } else if (isPrimitiveValue(children)) {
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

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/stream_element.ts
  function* streamElement(tagName, props) {
    const { children, ...attrs } = props && typeof props === "object" ? props : {};
    const awaitedAttrs = awaitedProps(attrs);
    if (isPromiseLike(awaitedAttrs)) {
      yield awaitedAttrs.then((attrs2) => {
        return streamElement(tagName, { children, attrs: attrs2 });
      });
    } else {
      if (isVoidElement(tagName)) {
        yield voidTag(tagName, awaitedAttrs);
      } else {
        yield openTag(tagName, awaitedAttrs);
        const __html = awaitedAttrs.dangerouslySetInnerHTML?.__html;
        if (typeof __html === "string") {
          yield safe(__html);
        } else {
          yield* streamFragment(children);
        }
        yield closeTag(tagName);
      }
    }
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/_internal/stream_unknown.ts
  async function* streamUnknown(type) {
    console.warn(`Unknown JSX type: ${type}`);
  }

  // https://jsr.io/@http/jsx-stream/0.1.1/jsx-runtime.ts
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

  // lib/render_html.tsx
  function renderHTML(Component, props, headers, options) {
    return html(
      prependDocType(
        renderBody(/* @__PURE__ */ jsx(Component, { ...props }), options)
      ),
      headers
    );
  }

  // lib/handle_fragment.ts
  function handleFragment(Component, headers) {
    return byMethod({
      GET: (req, match) => renderHTML(Component, { req, match }, headers, FRAGMENT_RENDER_OPTIONS)
    });
  }

  // routes/calc/_lib/evaluate.js
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

  // https://jsr.io/@http/request/0.9.0-beta.3/search_values.ts
  function getSearchValues(input) {
    const searchParams = input instanceof Request ? new URL(input.url).searchParams : input instanceof URL ? input.searchParams : input instanceof URLSearchParams ? input : input && "search" in input && "input" in input.search ? new URLSearchParams(input.search.input) : void 0;
    return (param, separator) => searchParams ? separator ? searchParams.getAll(param).join(separator).split(separator).filter(
      (v) => v !== ""
    ) : searchParams.getAll(param) : [];
  }

  // routes/calc/_components/Evaluate.tsx
  async function Evaluate({ expr }) {
    if (expr) {
      console.log("Calculating...", expr);
      await new Promise((resolve) => setTimeout(resolve, 1));
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
      expr: req && getSearchValues(req, "expr")[0] || ""
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
    const response = await routes_default(event.request);
    if (response) {
      event.respondWith(response);
    }
  });
})();
