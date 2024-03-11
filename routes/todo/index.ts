import { byMethod } from "@http/fns/by_method";
import { seeOther } from "@http/fns/response/see_other";
import { newId } from "./_lib/id.ts";

export default byMethod({
  GET: (_req, match: URLPatternResult) => {
    const listId = newId();
    return seeOther(`${match.pathname.input}/${listId}`);
  },
});
