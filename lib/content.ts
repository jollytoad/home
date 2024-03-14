import { notFound } from "@http/fns/response/not_found";

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
