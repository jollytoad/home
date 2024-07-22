if (!globalThis.URLPattern) {
  await import("urlpattern-polyfill");
}

//@ts-expect-error: https://github.com/denoland/deno/issues/24671
if (!globalThis.ReadableStream.from) {
  //@ts-expect-error: https://github.com/denoland/deno/issues/24671
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
