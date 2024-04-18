import { byMethod } from "@http/route/by-method";
import { serveDir } from "@std/http/file-server";
import { fromFileUrl } from "@std/path/from-file-url";

export default byMethod({
  GET(req, match: URLPatternResult) {
    const path = match.pathname.groups.path ?? "";
    const urlRoot = match.pathname.input.slice(1, -path.length);
    const fsRoot = fromFileUrl(
      import.meta.resolve(`../routes/${urlRoot}_static`),
    );
    return serveDir(req, { quiet: true, fsRoot, urlRoot });
  },
});
