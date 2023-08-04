import type {
  DiscoveredPath,
  DiscoveredRoute,
} from "$http_fns/discover_routes.ts";

export default function routeMapper(
  { parentPath, name, ext, pattern, module }: DiscoveredPath,
): DiscoveredRoute[] {
  // Skip any route that has a path segment that starts with an underscore
  if (name.startsWith("_") || /[/\\]_/.test(parentPath)) {
    return [];
  }

  switch (ext) {
    case ".ts":
    case ".tsx":
      return [{
        pattern,
        module,
      }];
    case ".md":
      return [{
        pattern: name === "index"
          ? [pattern, `${pattern}/index{.:ext}`]
          : `${pattern}{.:ext}?`,
        module: import.meta.resolve("@/lib/handle_route_md.tsx"),
      }];
  }
  return [];
}
