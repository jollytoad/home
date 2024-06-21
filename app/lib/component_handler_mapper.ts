import type { RequestHandler, RouteModule } from "@http/generate/types";
import type { RouteProps } from "./types.ts";
import type { ComponentType } from "@http/jsx-stream/types";
import { handleComponent } from "./handle_component.tsx";

/**
 * A `HandlerMapper` that wraps a component in a full page.
 */
export function componentHandlerMapper(
  { module, loaded }: RouteModule,
): RequestHandler<[URLPatternResult]> | undefined {
  const [, component] = getComponent(loaded);
  if (component) {
    return handleComponent(component, module);
  }
}

/**
 * Find the first function that looks like a component
 */
export function getComponent(
  loaded: Record<string, unknown>,
): [string, ComponentType<RouteProps>] | [undefined, undefined] {
  const found = Object.entries(loaded).find(([name, value]) =>
    typeof value === "function" && /^([A-Z][a-z]+)+$/.test(name)
  );
  return found
    ? found as [string, ComponentType<RouteProps>]
    : [undefined, undefined];
}

export default componentHandlerMapper;
