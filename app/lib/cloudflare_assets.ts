import { notFound } from "@http/response/not-found";
import { getEnv, hasEnv } from "./env.ts";

type Fetcher = (req: Request | URL) => Promise<Response>;

export function hasAssetFetcher(req?: Request) {
  return hasEnv("ASSETS", req);
}

export function fetchAsset(
  assetReq: Request | URL,
  scope = assetReq,
): Promise<Response> {
  const assets = getEnv<{ fetch: Fetcher }>("ASSETS", scope);
  if (assets && typeof assets.fetch === "function") {
    return assets.fetch(assetReq);
  } else {
    return Promise.resolve(notFound());
  }
}
