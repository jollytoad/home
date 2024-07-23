import type { DiscoveredPath, DiscoveredRoute } from "@http/discovery/types";

export default function markdownRouteMapper(
  { name, ext, pattern }: DiscoveredPath,
): DiscoveredRoute[] {
  return ext === ".md"
    ? [{
      pattern: name === "index"
        ? [pattern, `${pattern}/index{.:ext}`]
        : `${pattern}{.:ext}?`,
      module: import.meta.resolve("../../app/lib/handle_route_md.tsx"),
    }]
    : [];
}

export function markdownAssetMapper(
  { ext, pattern, module }: DiscoveredPath,
): DiscoveredRoute[] {
  return ext === ".md"
    ? [{
      pattern: `${pattern}${ext}`,
      module,
    }]
    : [];
}
