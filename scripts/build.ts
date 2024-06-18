#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run

import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild-deno-loader";
import { fromFileUrl } from "@std/path/from-file-url";

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
      configPath: fromFileUrl(import.meta.resolve("../deno.json")),
      importMapURL: import.meta.resolve("../import_map_sw.json"),
    }),
    entryPoints: [
      fromFileUrl(import.meta.resolve("../service_worker/sw.js")),
      fromFileUrl(import.meta.resolve("../service_worker/sw_compat.js")),
    ],
    outdir: fromFileUrl(import.meta.resolve("../app/routes/_static")),
    bundle: true,
    platform: "browser",
    format: "iife",
    treeShaking: true,
    jsx: "automatic",
    jsxImportSource: "@http/jsx-stream",
    // minify: true
  });

  esbuild.stop();
}

if (import.meta.main) {
  await buildServiceWorker();
}
