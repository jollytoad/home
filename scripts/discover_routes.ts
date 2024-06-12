#!/usr/bin/env -S deno run

import { discoverRoutes } from "@http/discovery/discover-routes";
import freshPathMapper from "@http/discovery/fresh-path-mapper";

await discoverRoutes({
  fileRootUrl: import.meta.resolve("../routes"),
  pathMapper: freshPathMapper,
  verbose: true,
});
