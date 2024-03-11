import type { Children } from "$jsx/types";
import { delay } from "@std/async/delay";

export interface DelayedProps {
  delay: number;
  children: Children;
}

export async function Delayed(props: DelayedProps) {
  await delay(props.delay);

  return <>{props.children}</>;
}
