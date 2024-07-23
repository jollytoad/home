import type { Code, GeneratorOptions, RouteModule } from "@http/generate/types";
import {
  asCodePattern,
  code,
  importNamed,
  literalOf,
  relativeModulePath,
} from "@http/generate/code-builder";
import { getComponent } from "../../app/lib/component_handler_mapper.ts";

export const handlerMapper = import.meta.resolve(
  "../../app/lib/component_handler_mapper.ts",
);

const rootPath = import.meta.resolve("./..");

export function generate(
  { pattern, module, loaded }: RouteModule,
  { moduleOutUrl, httpModulePrefix, moduleImports }: GeneratorOptions,
  i: number,
): Code | undefined {
  const [name] = getComponent(loaded);

  if (name) {
    const byPattern = importNamed(
      `${httpModulePrefix}route/by-pattern`,
      "byPattern",
    );

    const handleComponent = importNamed(
      "./lib/handle_component.tsx",
      "handleComponent",
    );

    const modulePath = literalOf(
      relativeModulePath(module, rootPath).replace(".cloudflare/", ""),
    );

    switch (moduleImports) {
      case "dynamic": {
        const lazy = importNamed(`${httpModulePrefix}route/lazy`, "lazy");

        return code`${byPattern}(${
          asCodePattern(pattern)
        }, ${lazy}(async () => ${handleComponent}((await import(${
          literalOf(relativeModulePath(module, moduleOutUrl))
        })).${name}, ${modulePath})))`;
      }

      case "static": {
        const routeModule = importNamed(
          relativeModulePath(module, moduleOutUrl),
          `route_component_${i}`,
          name,
        );

        return code`${byPattern}(${
          asCodePattern(pattern)
        }, ${handleComponent}(${routeModule}, ${modulePath}))`;
      }
    }
  }
}
