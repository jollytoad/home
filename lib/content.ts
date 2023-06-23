import { notFound } from "$http_fns/response.ts";
import type { RequestProps } from "./route.ts";

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

export interface ContentProps extends RequestProps {
  content: Response;
}

export function fetchContentForPath(prefix: string, ext = "md") {
  return async function (
    req: Request,
    match: URLPatternResult,
  ): Promise<ContentProps> {
    const content = await fetchContent(
      `${prefix}/${match.pathname.groups.path || "index"}.${ext}`,
    );
    if (content.ok) {
      return { req, content };
    } else {
      throw content;
    }
  };
}

export function rawContent(_req: Request, { content }: ContentProps) {
  return content;
}
