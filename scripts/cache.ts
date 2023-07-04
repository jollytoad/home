import { ensureDir } from "$std/fs/ensure_dir.ts";
import { emptyDir } from "$std/fs/empty_dir.ts";
import { dirname } from "$std/path/mod.ts";
import { deferred } from "$std/async/deferred.ts";
import { pooledMap } from "$std/async/pool.ts";
import { serve } from "$ahx_fns/http/server.ts";
import { withFallback } from "$http_fns/fallback.ts";
import init from "@/init.ts";
import routes from "@/routes.ts";
import cached_routes from "@/cached_routes.ts";

const controller = new AbortController();

const ready = deferred<{ port: number }>();

const server = serve(withFallback(routes), {
  ...init,
  port: 8765,
  signal: controller.signal,
  onListen: (props) => {
    ready.resolve(props);
  },
});

await emptyDir("./cache");

const { port } = await ready;

const reqInit: RequestInit = {
  headers: {
    "Deferred-Timeout": "false",
  },
};

const results = pooledMap(4, cached_routes, async (route) => {
  const url = new URL(route, `http://localhost:${port}`);

  console.log("Fetching:", url.href);

  const response = await fetch(url, reqInit);

  if (response.ok && response.status === 200 && response.body) {
    const file = `./cache${route}`;
    await ensureDir(dirname(file));
    await Deno.writeFile(`./cache${route}`, response.body);
    return file;
  }
});

for await (const file of results) {
  console.log("Cached:", file);
}

controller.abort();

await server;
