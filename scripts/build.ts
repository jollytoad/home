import * as esbuild from "https://deno.land/x/esbuild@v0.19.7/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.2/mod.ts";
import { fromFileUrl } from "$std/path/mod.ts";

/**
 * Build the ServiceWorker script
 *
 * NOTE: Not all browsers support module ServiceWorkers yet,
 * so this bundles as a script :(
 */
export async function buildServiceWorker() {
  console.debug("Building ServiceWorker");

  await esbuild.build({
    plugins: denoPlugins({
      configPath: fromFileUrl(import.meta.resolve("@/deno.json")),
      importMapURL: import.meta.resolve("@/import_map_sw.json"),
    }),
    entryPoints: ["@/service_worker/sw.js", "@/service_worker/sw_compat.js"],
    outdir: fromFileUrl(import.meta.resolve("@/static")),
    bundle: true,
    platform: "browser",
    format: "iife",
    treeShaking: true,
    jsx: "automatic",
    jsxImportSource: "$jsx",
    // minify: true
  });

  esbuild.stop();
}

if (import.meta.main) {
  await buildServiceWorker();
}
