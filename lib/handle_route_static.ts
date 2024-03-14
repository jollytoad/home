import { byMethod } from "@http/fns/by_method";
import { fetchContent } from "../lib/content.ts";

// TODO: Migrate all static content that relies on this to a _static folder instead

export default byMethod({
  GET: rawContent,
});

function rawContent(_req: Request, match: URLPatternResult) {
  return fetchContent(import.meta.resolve(`../routes${match.pathname.input}`));
}
