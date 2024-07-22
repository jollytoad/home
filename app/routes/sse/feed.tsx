import { delay } from "@std/async/delay";
import { ok } from "@http/response/ok";
import { renderString } from "@http/jsx-stream";
import type { JSX } from "@http/jsx-stream/jsx-runtime";

export default function (_req: Request) {
  //@ts-expect-error: https://github.com/denoland/deno/issues/24671
  const body = ReadableStream.from(streamEvents())
    .pipeThrough(new TextEncoderStream());

  return ok(body, {
    "Content-Type": "text/event-stream",
  });
}

async function* streamEvents() {
  for (let i = 1; i < 10; i++) {
    console.log(`Sending Item ${i}`);
    yield htmlEvent(<Item count={i} />);
    await delay(1000);
  }
  console.log(`Feed Complete`);
  yield htmlEvent(<Complete />);
}

function Item({ count }: { count: number }) {
  return <div>Item {count}</div>;
}

function Complete() {
  return <div id="control" hx-swap-oob="true">Feed has completed</div>;
}

async function htmlEvent(node: JSX.Element) {
  return renderEvent(await renderString(node));
}

// TODO: Consider adding SSE event helper functions into http_fns
function renderEvent(content: string) {
  return content.split(/\r?\n/).map((s) => `data: ${s}`).join("\n") + "\n\n";
}
