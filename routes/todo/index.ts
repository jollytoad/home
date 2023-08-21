import { byMethod } from "$http_fns/method.ts";
import { seeOther } from "$http_fns/response/see_other.ts";
import { newId } from "./_lib/id.ts";

export default byMethod({
  GET: (_req, match: URLPatternResult) => {
    const listId = newId();
    return seeOther(`${match.pathname.input}/${listId}`);
  },
});
