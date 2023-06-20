import type { Children } from "$jsx/types.ts";
import { delay } from "https://deno.land/std@0.192.0/async/delay.ts";

export interface DelayedProps {
  delay: number;
  children: Children;
}

export async function Delayed(props: DelayedProps) {
  await delay(props.delay);

  return <>{props.children}</>;
}
