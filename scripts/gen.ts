import { GenerateOptions, generateRoutesModule } from "$http_fns/generate.ts";

function generateRoutes(dynamic: GenerateOptions["dynamic"] = "lazy") {
  return generateRoutesModule(
    "/",
    import.meta.resolve("@/routes"),
    import.meta.resolve("@/routes.ts"),
    {
      dynamic,
      httpFns: "$http_fns/",
    },
  );
}

export default generateRoutes;

if (import.meta.main) {
  await generateRoutes();
}
