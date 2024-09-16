import type { Code, GeneratorOptions, RouteModule } from "@http/generate/types";
import {
  asFn,
  importNamed,
  importResolve,
  staticImport,
} from "@http/generate/code-builder";
import { getComponent } from "../../app/lib/component_handler_mapper.ts";

export const handlerMapper = import.meta.resolve(
  "../../app/lib/component_handler_mapper.ts",
);

export function generate(
  { module, loaded }: RouteModule,
  {}: GeneratorOptions,
  i: number,
): Code | undefined {
  const [name] = getComponent(loaded);

  if (name) {
    const handleComponent = asFn(staticImport(importNamed(
      "./lib/handle_component.tsx",
      "handleComponent",
    )));

    const modulePath = importResolve(module);

    const componentModule = importNamed(module, name, `route_component_${i}`);

    return handleComponent(componentModule, modulePath);
  }
}
