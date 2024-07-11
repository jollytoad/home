export default class extends TransformStream<Uint8Array, string>
  implements TextDecoderStream {
  encoding: string;
  fatal: boolean;
  ignoreBOM: boolean;

  constructor(label = "utf-8", options?: TextDecoderOptions) {
    let decoder: TextDecoder;

    super({
      start() {
        decoder = new TextDecoder(label, options);
      },
      transform(chunk, controller) {
        controller.enqueue(decoder.decode(chunk));
      },
      flush(controller) {
        controller.enqueue(decoder.decode());
        decoder = undefined!;
      },
    });

    this.encoding = label;
    this.fatal = options?.fatal ?? false;
    this.ignoreBOM = options?.ignoreBOM ?? false;
  }

  [Symbol.toStringTag] = "TextDecoderStream";
}
