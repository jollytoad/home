import { byMethod } from "@http/fns/by_method";
import { mapData } from "@http/fns/map_data";
import { signIn } from "$deno_kv_oauth/sign_in.ts";
import { asOAuth2ClientConfig } from "../_lib/oauth_config.ts";

export default byMethod({
  GET: mapData(asOAuth2ClientConfig, signIn),
});
