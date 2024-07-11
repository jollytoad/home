import { byMethod } from "@http/route/by-method";
import { serveDir } from "@http/fs/serve-dir";
import { fromFileUrl } from "@std/path/from-file-url";
import { interceptResponse } from "@http/interceptor/intercept-response";
import { skip } from "@http/interceptor/skip";

export default interceptResponse(
  byMethod({
    GET(req, match: URLPatternResult) {
      const path = match.pathname.groups.path ?? "";
      const urlRoot = match.pathname.input.slice(1, -path.length);
      const fsRoot = fromFileUrl(
        import.meta.resolve(`../routes/${urlRoot}_static`),
      );
      return serveDir(req, { fsRoot, urlRoot });
    },
  }),
  skip(404, 405),
);
