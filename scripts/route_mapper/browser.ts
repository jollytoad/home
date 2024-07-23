import type {
  DiscoveredPath,
  DiscoveredRoute,
  StopRouteMapping,
} from "@http/discovery/types";

export default function browserRouteMapper(
  { parentPath, pattern, ext }: DiscoveredPath,
): (DiscoveredRoute | StopRouteMapping)[] {
  // Treat any route under a `_browser` dir as scripts deliverable to the browser
  // which should be transpiled to js with broad compatibility and any necessary shims
  return ext === ".ts" && /[/\\]_browser/.test(parentPath)
    ? [{
      pattern: `${
        pattern.replace(/^(.*\/)_browser\/(.+)$/, ":pre($1):path+")
      }.js`,
      module: import.meta.resolve("../../app/lib/handle_route_browser_dir.ts"),
    }, {
      stop: true,
    }]
    : [];
}

export function browserAssetMapper(
  { parentPath, pattern, ext, module }: DiscoveredPath,
): (DiscoveredRoute & { cache: boolean })[] {
  return ext === ".ts" && /[/\\]_browser/.test(parentPath)
    ? [{
      pattern: `${pattern.replace(/_browser\//, "")}.js`,
      module,
      cache: true,
    }]
    : [];
}
