import { notFound } from "@http/response/not-found";
import { getEnv, hasEnv } from "./env.ts";

type Fetcher = (req: Request) => Promise<Response>;

export function hasAssetFetcher(req?: Request) {
  return hasEnv("ASSETS", req);
}

export function fetchAsset(
  assetReq: Request,
  scope = assetReq,
): Promise<Response> {
  const assets = getEnv<{ fetch: Fetcher }>("ASSETS", scope);
  if (assets && typeof assets.fetch === "function") {
    console.log("ASSET", assetReq.url, assets);
    // todo: adjust assetReq!
    return assets.fetch(assetReq);
  } else {
    return Promise.resolve(notFound());
  }
}
