import { discoverRoutes } from "@http/fns/discover_routes";
import freshPathMapper from "@http/fns/fresh/path_mapper";

await discoverRoutes({
  fileRootUrl: import.meta.resolve("../routes"),
  pathMapper: freshPathMapper,
  verbose: true,
});
