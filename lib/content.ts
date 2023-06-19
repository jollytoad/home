import { notFound, ok } from "$http_fns/response.ts";

export async function readContent(
  name: string,
  ext = "md",
): Promise<Response> {
  console.log(`%cLoading content: ${name}.${ext}`, "color: yellow");

  try {
    const url = new URL(import.meta.resolve(`${name}.${ext}`));

    const file = await Deno.open(url);

    return ok(file.readable);
  } catch {
    console.log("%cContent not found", "color: red");
    return notFound();
  }
}

export interface ContentStreamProps {
  content: Response;
}

export function getContentStreamForPath(prefix: string) {
  return async function (
    _req: Request,
    info: URLPatternResult,
  ): Promise<ContentStreamProps> {
    const content = await readContent(`${prefix}/${info.pathname.groups.path}`);
    if (content.ok) {
      return { content };
    } else {
      throw content;
    }
  };
}
