#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net

import { createGraph, type ModuleJson } from "@deno/graph";
import { createCache } from "@deno/cache-dir";
import { resolve } from "@std/path/resolve";

async function listPackages(type: "jsr" | "npm", ...entrypoints: string[]) {
  const rootSpecifiers = entrypoints.map((filename) =>
    import.meta.resolve(resolve(filename))
  );
  const cache = createCache();
  const { cacheInfo, load } = cache;
  const graph = await createGraph(rootSpecifiers, {
    cacheInfo,
    load: (
      specifier: string,
      isDynamic?: boolean,
      _cacheSetting?: unknown,
      checksum?: string,
    ) => {
      // WORK-AROUND: For some unknown reason cacheSetting is getting passed as "only"
      // so this hack overrides that!
      return load(specifier, isDynamic, "use", checksum);
    },
    resolve: (specifier, referrer) => {
      if (specifier.startsWith(".")) {
        return new URL(specifier, referrer).href;
      } else {
        return import.meta.resolve(specifier);
      }
    },
    kind: "codeOnly",
  });

  const packages = new Set<string>();

  const roots = graph.modules.filter((m) => graph.roots.includes(m.specifier));

  function scan(m?: ModuleJson) {
    m?.dependencies?.forEach((d) => {
      const specifier = d.code?.specifier;
      if (specifier?.startsWith("file:")) {
        scan(graph.modules.find((m) => m.specifier === d.code?.specifier));
      } else if (specifier?.startsWith(`${type}:`)) {
        const url = new URL(specifier);

        switch (type) {
          case "jsr":
            packages.add(
              url.pathname.replace(/^\//, "").split("/", 2).join("/"),
            );
            break;
          case "npm":
            packages.add(url.pathname);
            break;
        }
      }
    });
  }

  roots.forEach(scan);

  console.log([...packages].join(" "));
}

if (import.meta.main) {
  const [type, ...entrypoints] = Deno.args;
  if ((type === "npm" || type === "jsr") && entrypoints.length) {
    await listPackages(type, ...entrypoints);
  } else {
    console.error("list_packages <npm|jsr> <entrypoints...>");
    Deno.exit(1);
  }
}
