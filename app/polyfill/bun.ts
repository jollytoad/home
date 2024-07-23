if (!globalThis.URLPattern) {
  await import("urlpattern-polyfill");
}

if (!globalThis.ReadableStream.from) {
  globalThis.ReadableStream.from =
    (await import("./ReadableStream_from.ts")).default;
}

if (!globalThis.TextEncoderStream) {
  globalThis.TextEncoderStream =
    (await import("./TextEncoderStream.ts")).default;
}

if (!globalThis.TextDecoderStream) {
  globalThis.TextDecoderStream =
    (await import("./TextDecoderStream.ts")).default;
}
