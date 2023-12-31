import { byMethod } from "$http_fns/by_method.ts";
import { fetchContent } from "@/lib/content.ts";

export default byMethod({
  GET: rawContent,
});

function rawContent(_req: Request, match: URLPatternResult) {
  return fetchContent(import.meta.resolve(`@/routes${match.pathname.input}`));
}
