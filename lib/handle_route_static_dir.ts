import { byMethod } from "@http/fns/by_method";
import { fetchContent } from "../lib/content.ts";

export default byMethod({
  GET: rawContent,
});

function rawContent(_req: Request, match: URLPatternResult) {
  const path = match.pathname.groups.path ?? "";
  const prefix = match.pathname.input.slice(0, -path.length);
  const route = `../routes${prefix}_static/${path}`;
  return fetchContent(import.meta.resolve(route));
}
