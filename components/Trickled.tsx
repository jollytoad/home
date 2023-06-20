import type { Children } from "$jsx/types.ts";
import { isAsyncIterable, isIterable } from "$jsx/guards.ts";
import { delay } from "https://deno.land/std@0.192.0/async/delay.ts";
import type { JSX } from "$jsx/jsx-runtime.ts";

export interface TrickledProps {
  delay: number;
  children: Children;
}

export async function* Trickled(props: TrickledProps): JSX.Element {
  if (isIterable(props.children) || isAsyncIterable(props.children)) {
    for await (const child of props.children) {
      await delay(props.delay);
      yield child;
    }
  }
}
