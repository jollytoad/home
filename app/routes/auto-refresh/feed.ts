import { ok } from "@http/response/ok";
import { delay } from "@std/async/delay";
import { byMediaType } from "@http/route/by-media-type";

export const GET = byMediaType({
  "text/event-stream": (_req: Request) => {
    //@ts-expect-error: https://github.com/denoland/deno/issues/24671
    const body = ReadableStream.from(streamEvents())
      .pipeThrough(new TextEncoderStream());

    return ok(body, {
      "Content-Type": "text/event-stream",
    });
  },
});

async function* streamEvents() {
  yield "event: refresh\n";
  yield "data: refresh\n";
  yield "\n\n";

  while (true) {
    await delay(30000, { persistent: false });
    yield "event: ping\n";
    yield "data: ping\n";
    yield "\n\n";
  }
}
