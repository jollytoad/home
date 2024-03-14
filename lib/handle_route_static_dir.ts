import { byMethod } from "@http/fns/by_method";
import { serveDir } from "@std/http/file_server";
import { fromFileUrl } from "@std/path/from_file_url";

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
