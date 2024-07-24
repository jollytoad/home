import { notFound } from "@http/response/not-found";
import { getEnv, hasEnv } from "./env.ts";

type Fetcher = (req: Request | URL) => Promise<Response>;

export function hasAssetFetcher(req?: Request) {
  return hasEnv("ASSETS", req);
}

export function fetchAsset(
  asset: Request | URL,
  scope: Request,
): Promise<Response> {
  const assets = getEnv<{ fetch: Fetcher }>("ASSETS", scope);
  if (assets && typeof assets.fetch === "function") {
    return assets.fetch(asset);
  } else {
    return Promise.resolve(notFound());
  }
}

export function handleAsset(
  req: Request,
): Promise<Response> {
  return fetchAsset(req, req);
}
