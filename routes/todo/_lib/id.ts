import { ulid } from "https://deno.land/x/ulid@v0.2.1/mod.ts";

export function newId(): string {
  return ulid();
}
