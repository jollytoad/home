import type { Children, SyncNode } from "$jsx/types.ts";
import { isAsyncIterable, isIterable } from "$jsx/guards.ts";
import { delay } from "$std/async/delay.ts";

export interface TrickledProps {
  delay: number;
  children: Children;
}

export async function* Trickled(props: TrickledProps) {
  if (
    isIterable<SyncNode>(props.children) ||
    isAsyncIterable<SyncNode>(props.children)
  ) {
    for await (const child of props.children) {
      await delay(props.delay);
      yield child;
    }
  }
}
