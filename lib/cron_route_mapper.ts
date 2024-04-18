import type {
  DiscoveredPath,
  DiscoveredRoute,
} from "@http/discovery/discover-routes";

export default function cronRouteMapper(
  { parentPath, name, ext, pattern, module }: DiscoveredPath,
): DiscoveredRoute[] {
  if (/[/\\]_cron/.test(parentPath) && !name.startsWith("_")) {
    switch (ext) {
      case ".ts":
      case ".tsx":
        return [{
          pattern,
          module,
        }];
    }
  }
  return [];
}
