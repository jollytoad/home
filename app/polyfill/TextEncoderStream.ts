export default class extends TransformStream<string, Uint8Array>
  implements TextEncoderStream {
  encoding = "utf-8" as const;

  constructor() {
    let encoder: TextEncoder;

    super({
      start() {
        encoder = new TextEncoder();
      },
      transform(chunk, controller) {
        controller.enqueue(encoder.encode(chunk));
      },
      flush(controller) {
        controller.enqueue(encoder.encode());
        encoder = undefined!;
      },
    });
  }

  [Symbol.toStringTag] = "TextEncoderStream";
}
