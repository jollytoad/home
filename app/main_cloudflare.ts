import handler from "./handler.ts";
import { setStore } from "@jollytoad/store";
import { envInterceptor } from "./lib/env.ts";
import { cascade } from "@http/route/cascade";
import init from "@http/host-cloudflare-worker/init";
import { assetHandler } from "@http/host-cloudflare-worker/asset-handler";

setStore(import("@jollytoad/store-no-op"));

export default init(cascade(assetHandler, handler), envInterceptor());
