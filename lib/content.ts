import { notFound } from "$http_fns/response.ts";

export async function fetchContent(
  name: string,
): Promise<Response> {
  try {
    const url = new URL(import.meta.resolve(name));

    console.log(`%cLoading content: ${url}`, "color: yellow");

    return await fetch(url);
  } catch {
    return notFound();
  }
}

export interface ContentProps {
  content: Response;
}

export function fetchContentForPath(prefix: string, ext = "md") {
  return async function (
    _req: Request,
    info: URLPatternResult,
  ): Promise<ContentProps> {
    const content = await fetchContent(
      `${prefix}/${info.pathname.groups.path || "index"}.${ext}`,
    );
    if (content.ok) {
      return { content };
    } else {
      throw content;
    }
  };
}

export function rawContent(_req: Request, { content }: ContentProps) {
  return content;
}
