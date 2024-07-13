import { byMethod } from "@http/route/by-method";
// import { serveDir } from "@http/fs/serve-dir";
// import { fromFileUrl } from "@std/path/from-file-url";
import { interceptResponse } from "@http/interceptor/intercept-response";
import { skip } from "@http/interceptor/skip";
import { fetchAsset } from "./cloudflare_assets.ts";

export default interceptResponse(
  byMethod({
    GET(req, _match: URLPatternResult) {
      // if (hasAssetFetcher()) {
      return fetchAsset(req);
      // } else {
      // console.log("NO FETCH ASSET");

      // const { serveDir } = await import("@http/fs/serve-dir");

      // const path = match.pathname.groups.path ?? "";
      // const urlRoot = match.pathname.input.slice(1, -path.length);
      // const fsRoot = fromFileUrl(
      //   import.meta.resolve(`../routes/${urlRoot}_static`),
      // );

      // return serveDir(req, { fsRoot, urlRoot });
      // }
    },
  }),
  skip(404, 405),
);
