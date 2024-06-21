#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env --allow-ffi scripts/gen.ts

import {
  type GenerateOptions,
  generateRoutesModule,
} from "@http/generate/generate-routes-module";
import { generateCronModule } from "./generate_cron_module.ts";

type Opts = Pick<
  GenerateOptions,
  "routeDiscovery" | "moduleImports" | "verbose"
>;

const defaultOpts: Opts = {
  routeDiscovery: "static",
  moduleImports: "dynamic",
  verbose: true,
};

export function generateRoutes(opts: Opts = defaultOpts) {
  console.debug("\nGenerating routes:", opts);

  return generateRoutesModule({
    pattern: "/",
    fileRootUrl: import.meta.resolve("../app/routes"),
    moduleOutUrl: import.meta.resolve("../app/routes.ts"),
    pathMapper: "@http/discovery/fresh-path-mapper",
    routeMapper: [
      import.meta.resolve("./route_mapper/static.ts"),
      import.meta.resolve("./route_mapper/ignore.ts"),
      "@http/discovery/ts-route-mapper",
      import.meta.resolve("./route_mapper/markdown.ts"),
    ],
    handlerGenerator: [
      import("./handler_generator/component.ts"),
      import("@http/generate/default-handler-generator"),
      import("@http/generate/methods-handler-generator"),
    ],
    ...opts,
  });
}

export function generateCron() {
  console.debug("\nGenerating cron module:");

  return generateCronModule({
    fileRootUrl: import.meta.resolve("../app/routes"),
    moduleOutUrl: import.meta.resolve("../app/cron.ts"),
    verbose: true,
  });
}

if (import.meta.main) {
  await generateRoutes();
  await generateCron();
}
