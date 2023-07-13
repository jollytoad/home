import { GenerateOptions, generateRoutesModule } from "$http_fns/generate.ts";

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
    fileRootUrl: import.meta.resolve("@/routes"),
    moduleOutUrl: import.meta.resolve("@/routes.ts"),
    pathMapper: "$http_fns/fresh/path_mapper.ts",
    routeMapper: "@/lib/route_mapper.ts",
    httpFns: "$http_fns/",
    ...opts,
  });
}

export default generateRoutes;

if (import.meta.main) {
  await generateRoutes();
}
