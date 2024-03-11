import {
  type GenerateOptions,
  generateRoutesModule,
} from "@http/fns/generate_routes_module";

type Opts = Pick<
  GenerateOptions,
  "routeDiscovery" | "moduleImports" | "verbose"
>;

const defaultOpts: Opts = {
  routeDiscovery: "static",
  moduleImports: "dynamic",
  verbose: true,
};

function generateRoutes(opts: Opts = defaultOpts) {
  console.debug("Generating routes:", opts);

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

export default generateRoutes;

if (import.meta.main) {
  await generateRoutes();
}
