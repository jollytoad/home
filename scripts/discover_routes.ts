import { discoverRoutes } from "$http_fns/discover_routes.ts";
import freshPathMapper from "$http_fns/fresh/path_mapper.ts";

await discoverRoutes({
  fileRootUrl: import.meta.resolve("@/routes"),
  pathMapper: freshPathMapper,
  verbose: true,
});
