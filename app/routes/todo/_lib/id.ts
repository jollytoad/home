import { ulid } from "@std/ulid";

export function newId(): string {
  return ulid();
}
