import type { DiscoveredPath, StopRouteMapping } from "@http/discovery/types";

export default function ignoredRouteMapper(
  { parentPath, name }: DiscoveredPath,
): StopRouteMapping[] {
  // Skip any route that has a path segment that starts with an underscore
  return (name.startsWith("_") || /(^|[/\\])_/.test(parentPath))
    ? [{ stop: true }]
    : [];
}
