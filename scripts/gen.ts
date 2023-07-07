import { GenerateOptions, generateRoutesModule } from "$http_fns/generate.ts";

const defaultOpts: GenerateOptions = {
  routeDiscovery: "static",
  moduleImports: "dynamic",
};

function generateRoutes(opts: GenerateOptions = defaultOpts) {
  console.debug("Generating routes:", opts);

  return generateRoutesModule(
    "/",
    import.meta.resolve("@/routes"),
    import.meta.resolve("@/routes.ts"),
    {
      ...opts,
      httpFns: "$http_fns/",
    },
  );
}

export default generateRoutes;

if (import.meta.main) {
  await generateRoutes();
}
