#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

import { ensureDir } from "@std/fs/ensure-dir";
import { emptyDir } from "@std/fs/empty-dir";
import { dirname } from "@std/path/dirname";
import { resolve } from "@std/path/resolve";
import { pooledMap } from "@std/async/pool";
import { withFallback } from "@http/route/with-fallback";
import routes from "../app/routes.ts";
import cached_routes from "../cached_routes.ts";

const CACHE_DIR = resolve(import.meta.dirname!, "../app/cache");

const handler = withFallback(routes);

await emptyDir(CACHE_DIR);

const reqInit: RequestInit = {
  headers: {
    "Deferred-Timeout": "false",
  },
};

const results = pooledMap(4, cached_routes, async (route) => {
  console.log(`Caching: %c${route}`, "color: orange");

  const url = new URL(route, "http://localhost");

  try {
    const response = await handler(new Request(url, reqInit));

    if (response.ok && response.status === 200 && response.body) {
      const file = `${CACHE_DIR}${route === "/" ? "/index.html" : route}`;
      await ensureDir(dirname(file));
      await Deno.writeFile(file, response.body);
      return file;
    }
  } catch (e) {
    console.error(`Error whilst fetching: ${url.href}`, e);
  }
});

for await (const file of results) {
  console.log(`Cached: %c${file}`, "color: green");
}
