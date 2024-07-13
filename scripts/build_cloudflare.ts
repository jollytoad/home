#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run

import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild-deno-loader";
import { extname, fromFileUrl, join, relative, toFileUrl } from "@std/path";
import { walk } from "@std/fs/walk";

/**
 * Build the Cloudflare dist
 */
export async function buildCloudflareWorker() {
  console.debug("\nTransforming Cloudflare App...\n");

  const root = fromFileUrl(import.meta.resolve("../app"));
  const dist = fromFileUrl(import.meta.resolve("../.cloudflare/dist"));

  for await (const { path, isDirectory, isFile } of walk(root)) {
    const relPath = relative(root, path);
    const distPath = join(dist, relPath);

    if (isDirectory) {
      Deno.mkdir(distPath, { recursive: true });
    } else if (isFile) {
      const ext = extname(path);
      switch (ext) {
        case ".js":
        case ".ts":
        // deno-lint-ignore no-fallthrough
        case ".tsx": {
          const contentIn = await Deno.readTextFile(path);
          const url = toFileUrl(`/${relPath}`);

          let contentOut = contentIn;

          // Replace `import.meta.url` and `import.meta.resolve` with hardcoded values
          contentOut = contentOut.replaceAll("import.meta.url", `"${url}"`);
          contentOut = contentOut.replaceAll(
            "import.meta.resolve",
            `import_meta_resolve`,
          );

          // const result = await esbuild.transform(contentIn, {
          //   sourcefile: path,
          //   platform: "neutral",
          //   format: "esm",
          //   loader: ext.slice(1) as esbuild.Loader,
          //   jsx: "preserve",
          //   define: {
          //     "import.meta.url": `"${url}"`,
          //     "import.meta.resolve": `import_meta_resolve`
          //   }
          // });

          if (contentOut.includes("import_meta_resolve")) {
            contentOut +=
              `\nfunction import_meta_resolve(path: string) { return new URL(path, "${url}").href; }\n`;
          }

          if (contentOut !== contentIn) {
            console.log(`%cTRANSFORM ${path} -> ${distPath}`, "color: yellow");
            await Deno.writeTextFile(distPath, contentOut);
            break;
          }
          // fallthrough
        }

        default:
          console.log(`%cCOPY ${path} -> ${distPath}`, "color: green");
          await Deno.copyFile(path, distPath);
      }
    }
  }

  console.debug("\nBundling Cloudflare Worker...\n");

  await esbuild.build({
    plugins: [
      ...denoPlugins({
        configPath: fromFileUrl(import.meta.resolve("../deno.json")),
      }),
    ],
    entryPoints: [
      fromFileUrl(
        import.meta.resolve("../.cloudflare/dist/main_cloudflare.ts"),
      ),
    ],
    outfile: fromFileUrl(import.meta.resolve("../.cloudflare/dist/_worker.js")),
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

if (import.meta.main) {
  await buildCloudflareWorker();
}
