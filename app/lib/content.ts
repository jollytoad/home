import { notFound } from "@http/response/not-found";
import { fetchAsset, hasAssetFetcher } from "./cloudflare_assets.ts";

export async function fetchContent(
  name: string,
  req?: Request,
): Promise<Response> {
  try {
    if (req && hasAssetFetcher(req)) {
      const url = new URL(name.replace("file:///routes", ""), req.url);

      console.log(`%cLoading asset: ${url}`, "color: yellow");

      return await fetchAsset(url, req);
    } else {
      const url = new URL(import.meta.resolve(name));

      console.log(`%cLoading content: ${url}`, "color: yellow");

      return await fetch(url);
    }
  } catch {
    return notFound();
  }
}
