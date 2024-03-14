import type {
  DiscoveredPath,
  DiscoveredRoute,
} from "@http/fns/discover_routes";

export default function routeMapper(
  { parentPath, name, ext, pattern, module }: DiscoveredPath,
): DiscoveredRoute[] {
  // Treat any route under a `_static` dir as static content
  if (/[/\\]_static/.test(parentPath)) {
    return [{
      pattern: pattern.replace(/_static\/.*/, ":path+"),
      module: import.meta.resolve("./handle_route_static_dir.ts"),
    }];
  }

  // Skip any route that has a path segment that starts with an underscore
  if (name.startsWith("_") || /(^|[/\\])_/.test(parentPath)) {
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
        module: import.meta.resolve("./handle_route_md.tsx"),
      }];
  }
  return [];
}
