import { transpile } from "@deno/emit";
import { ok } from "@http/response/ok";
import { plainError } from "@http/response/plain-error";

/**
 * Experimental on the fly transpilation of TS modules for the browser.
 *
 * Has yet to be rigorously tested with module graphs.
 */
export async function GET(_req: Request, match: URLPatternResult) {
  const fileUrl = getFileUrl(match);

  try {
    const emitted = await transpile(fileUrl);
    const content = emitted.get(fileUrl);

    if (content) {
      return ok(content, {
        "Content-Type": "text/javascript",
      });
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("Module not found")) {
      return null;
    } else {
      console.error(e);
      return plainError(
        500,
        "Internal Server Error",
        `Failed to transpile: ${fileUrl}\n\n` + String(e),
      );
    }
  }
  return null;
}

function getFileUrl(match: URLPatternResult): string {
  const pre = match.pathname.groups.pre ?? "";
  const path = match.pathname.groups.path ?? "";
  return import.meta.resolve(`../routes${pre}_browser/${path}.ts`);
}
