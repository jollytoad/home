import {
  type GenerateOptions,
  generateRoutesModule,
} from "@http/fns/generate_routes_module";
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
    pathMapper: "@http/fns/fresh/path_mapper",
    routeMapper: import.meta.resolve("../lib/route_mapper.ts"),
    httpFns: "@http/fns/",
    jsr: true,
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
