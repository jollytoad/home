import {
  discoverRoutes,
  type DiscoverRoutesOptions,
} from "@http/fns/discover_routes";
import { dirname } from "@std/path/posix/dirname";
import { relative } from "@std/path/posix/relative";
import { fromFileUrl } from "@std/path/posix/from_file_url";
import cronRouteMapper from "./cron_route_mapper.ts";
import { asSerializablePattern } from "@http/fns/as_serializable_pattern";

export interface GenerateCronOptions extends
  Omit<
    DiscoverRoutesOptions,
    "pattern" | "pathMapper" | "routeMapper" | "compare" | "consolidate"
  > {
  /**
   * The absolute path of the module to be generated, as a `file:` URL.
   */
  moduleOutUrl: string;

  /**
   * Module that supplies a RouteMapper as the default function,
   * this should filter to return just cron modules (the pattern is ignored).
   * The default RouteMapper will consider any module under a `_cron` folder.
   */
  routeMapper?: string | URL;
}

/**
 * Generate a TypeScript module that exports a routing handler as the default function.
 *
 * The generated code will vary depending on the options given.
 */
export async function generateCronModule({
  fileRootUrl,
  moduleOutUrl,
  routeMapper,
  verbose,
}: GenerateCronOptions): Promise<boolean> {
  assertIsFileUrl(fileRootUrl, "fileRootUrl");
  assertIsFileUrl(moduleOutUrl, "moduleOutUrl");

  const outUrl = new URL(moduleOutUrl);

  if (!await can("write", outUrl)) {
    // No permission to generate new module
    return false;
  }

  const outPath = dirname(outUrl.pathname);

  const head: string[] = [];
  const body: string[] = [];
  let i = 1;

  head.push(
    "// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.\n\n",
  );

  body.push("export default function initCron() {\n");

  const routes = await discoverRoutes({
    fileRootUrl,
    routeMapper: routeMapper
      ? (await import(routeMapper.toString())).default
      : cronRouteMapper,
    verbose,
  });

  for (const { pattern, module } of routes) {
    let modulePath = relative(outPath, fromFileUrl(module));
    if (modulePath[0] !== ".") {
      modulePath = "./" + modulePath;
    }

    const cronModule = await import(`${module}`);

    const mod = `cron_${i}`;
    const args = [
      "name" in cronModule
        ? `${mod}.name`
        : `"${asSerializablePattern(pattern)}"`,
      "schedule" in cronModule ? `${mod}.schedule` : `"* * * * *"`,
      ...("options" in cronModule ? [`${mod}.options`] : []),
      `${mod}.default`,
    ];
    head.push(`import * as ${mod} from "${modulePath}";\n`);
    body.push(`  Deno.cron(${args.join(", ")});\n`);

    i++;
  }

  body.push(`}\n`);

  head.push(`\n`);

  const content = head.concat(body).join("");

  let existingContent = undefined;

  if (await can("read", outUrl)) {
    try {
      existingContent = await Deno.readTextFile(outUrl);
    } catch {
      // Ignore error
    }
  }

  if (content !== existingContent) {
    console.debug("Writing new cron module:", outUrl.pathname);
    await Deno.writeTextFile(outUrl, content);
    return true;
  }

  return false;
}

async function can(
  name: "read" | "write",
  path: string | URL,
): Promise<boolean> {
  return (await Deno.permissions.query({ name, path })).state === "granted";
}

function assertIsFileUrl(
  url: string | URL | undefined,
  prop: string,
): void | never {
  if (!url || !URL.canParse(url) || new URL(url).protocol !== "file:") {
    throw new TypeError(
      `${prop} must be an absolute file URL, consider using 'import.meta.resolve'`,
    );
  }
}
