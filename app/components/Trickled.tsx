import type { Children } from "@http/jsx-stream/types";
import { isAsyncIterable, isIterable } from "@http/token-stream/guards";
import { delay } from "@std/async/delay";

export interface TrickledProps {
  delay: number;
  children: Children;
}

export async function* Trickled(props: TrickledProps) {
  if (
    isIterable<unknown>(props.children) ||
    isAsyncIterable<unknown>(props.children)
  ) {
    for await (const child of props.children) {
      await delay(props.delay);
      yield child;
    }
  }
}
