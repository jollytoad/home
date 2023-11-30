import type { Children } from "$jsx/types.ts";
import { isAsyncIterable, isIterable } from "$jsx/guards.ts";
import { delay } from "$std/async/delay.ts";

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
