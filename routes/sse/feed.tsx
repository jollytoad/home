import { delay } from "$std/async/delay.ts";
import { ok } from "$http_fns/response/ok.ts";
import { renderString } from "$jsx/serialize.ts";
import type { JSX } from "$jsx/jsx-runtime";

export default function (_req: Request) {
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
