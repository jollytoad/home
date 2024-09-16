#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run --allow-net --allow-ffi

import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild-deno-loader";
import {
  dirname,
  extname,
  fromFileUrl,
  join,
  relative,
  toFileUrl,
} from "@std/path";
import { walk } from "@std/fs/walk";
import { ensureDir } from "@std/fs/ensure-dir";
import { discoverRoutes } from "@http/discovery/discover-routes";
import freshPathMapper from "@http/discovery/fresh-path-mapper";
import { combinedRouteMapper } from "@http/discovery/combined-route-mapper";
import { browserAssetMapper } from "./route_mapper/browser.ts";
import { staticAssetMapper } from "./route_mapper/static.ts";
import { markdownAssetMapper } from "./route_mapper/markdown.ts";
import { asSerializablePattern } from "@http/discovery/as-serializable-pattern";
import { generateCache } from "./cache.ts";
import { emptyDir } from "@std/fs/empty-dir";
import { generateRoutesModule } from "@http/generate/generate-routes-module";
import { dprintFormatModule } from "@http/generate/dprint-format-module";

const ROOT = fromFileUrl(import.meta.resolve("../app"));
const CF_ROOT = fromFileUrl(import.meta.resolve("../.cloudflare"));
const APP = fromFileUrl(import.meta.resolve("../.cloudflare/app"));
const DIST = fromFileUrl(import.meta.resolve("../.cloudflare/dist"));

/**
 * Transform the source to be suitable for Cloudflare
 */
export async function transformCloudflareSource() {
  console.debug("\nTransforming Cloudflare App...\n");

  await ensureDir(APP);

  for await (const { path, isDirectory, isFile } of walk(ROOT)) {
    const relPath = relative(ROOT, path);
    const appPath = join(APP, relPath);

    if (isDirectory) {
      Deno.mkdir(appPath, { recursive: true });
    } else if (isFile) {
      const ext = extname(path);
      switch (ext) {
        case ".js":
        case ".ts":
        case ".tsx": {
          const contentIn = await Deno.readTextFile(path);
          const contentOut = transformCloudflareModule(path, contentIn);

          if (contentOut !== contentIn) {
            console.log(`%cTRANSFORM ${path} -> ${appPath}`, "color: yellow");
            await Deno.writeTextFile(appPath, contentOut);
          } else {
            console.log(`%cCOPY ${path} -> ${appPath}`, "color: green");
            await Deno.copyFile(path, appPath);
          }
          break;
        }

        default:
          // console.log(`%cCOPY ${path} -> ${buildPath}`, "color: green");
          // await Deno.copyFile(path, buildPath);
      }
    }
  }
}

/**
 * Transform a module to be suitable for Cloudflare
 */
export function transformCloudflareModule(
  path: string,
  contentIn: string,
): string {
  const relPath = relative(ROOT, path);

  const url = toFileUrl(`/${relPath}`);

  let contentOut = contentIn;

  // Replace `import.meta.url` and `import.meta.resolve` with hardcoded values
  contentOut = contentOut.replaceAll("import.meta.url", `"${url}"`);
  contentOut = contentOut.replaceAll(
    "import.meta.resolve",
    `import_meta_resolve`,
  );

  if (contentOut.includes("import_meta_resolve")) {
    contentOut +=
      `\nfunction import_meta_resolve(path: string) { return new URL(path, "${url}").href; }\n`;
  }

  return contentOut;
}

/**
 * Generate a routes.ts module tailored to Cloudflare
 */
export function generateCloudflareRoutes() {
  return generateRoutesModule({
    pattern: "/",
    fileRootUrl: toFileUrl(join(APP, "routes")),
    moduleOutUrl: toFileUrl(join(APP, "routes.ts")),
    pathMapper: "@http/discovery/fresh-path-mapper",
    routeMapper: [
      import.meta.resolve("./route_mapper/ignore.ts"),
      "@http/discovery/ts-route-mapper",
    ],
    handlerGenerator: [
      import("./handler_generator/component.ts"),
      import("@http/generate/default-handler-generator"),
      import("@http/generate/methods-handler-generator"),
    ],
    routeDiscovery: "static",
    moduleImports: "static",
    formatModule: (url, content) => {
      content = transformCloudflareModule(fromFileUrl(url), content);
      return dprintFormatModule()(url, content);
    },
    verbose: true,
  });
}

/**
 * Bundle the Cloudflare worker
 */
export async function bundleCloudflareWorker() {
  console.debug("\nBundling Cloudflare Worker...\n");

  await ensureDir(DIST);

  await esbuild.build({
    plugins: [
      ...denoPlugins({
        configPath: fromFileUrl(import.meta.resolve("../deno.json")),
      }),
    ],
    entryPoints: [
      join(APP, "main_cloudflare.ts"),
    ],
    outfile: join(DIST, "_worker.js"),
    bundle: true,
    platform: "node",
    format: "esm",
    treeShaking: true,
    jsx: "automatic",
    jsxImportSource: "@http/jsx-stream",
    // minify: true
  });

  esbuild.stop();
}

/**
 * Copy all Cloudflare assets
 */
export async function populateCloudflareAssets() {
  console.debug("\nCopy Cloudflare Assets...\n");

  await ensureDir(DIST);

  const routes = await discoverRoutes({
    pattern: "/",
    fileRootUrl: import.meta.resolve("../app/routes"),
    pathMapper: freshPathMapper,
    routeMapper: combinedRouteMapper(
      browserAssetMapper,
      staticAssetMapper,
      markdownAssetMapper,
    ),
    verbose: true,
  });

  const cachedRoutes = [...(await import("../cached_routes.ts")).default];

  for (const route of routes) {
    const pattern = asSerializablePattern(route.pattern);
    if (typeof pattern === "string") {
      if ("cache" in route && route.cache) {
        cachedRoutes.push(pattern);
      } else {
        const path = fromFileUrl(route.module);
        const distPath = join(DIST, pattern);
        console.log(`%cCOPY ${path} -> ${distPath}`, "color: green");
        await ensureDir(dirname(distPath));
        await Deno.copyFile(path, distPath);
      }
    }
  }

  console.debug("\nGenerating Cloudflare Cached Assets...\n");

  await generateCache(cachedRoutes, DIST, ".html");
}

if (import.meta.main) {
  await emptyDir(CF_ROOT);
  await transformCloudflareSource();
  await generateCloudflareRoutes();
  await bundleCloudflareWorker();
  await populateCloudflareAssets();
}
