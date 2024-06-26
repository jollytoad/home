import { seeOther } from "@http/response/see-other";
import { newId } from "./_lib/id.ts";

export function GET(_req: Request, match: URLPatternResult) {
  const listId = newId();
  return seeOther(`${match.pathname.input}/${listId}`);
}
