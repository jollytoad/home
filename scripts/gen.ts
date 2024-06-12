#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env --allow-ffi scripts/gen.ts

import {
  type GenerateOptions,
  generateRoutesModule,
} from "@http/generate/generate-routes-module";
import { generateCronModule } from "../lib/generate_cron_module.ts";

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
    fileRootUrl: import.meta.resolve("../routes"),
    moduleOutUrl: import.meta.resolve("../routes.ts"),
    pathMapper: "@http/discovery/fresh-path-mapper",
    routeMapper: import.meta.resolve("../lib/route_mapper.ts"),
    ...opts,
  });
}

export function generateCron() {
  console.debug("\nGenerating cron module:");

  return generateCronModule({
    fileRootUrl: import.meta.resolve("../routes"),
    moduleOutUrl: import.meta.resolve("../cron.ts"),
    verbose: true,
  });
}

if (import.meta.main) {
  await generateRoutes();
  await generateCron();
}
