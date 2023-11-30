import { byMethod } from "$http_fns/by_method.ts";
import { mapData } from "$http_fns/map_data.ts";
import { signIn } from "$deno_kv_oauth/sign_in.ts";
import { asOAuth2ClientConfig } from "../_lib/oauth_config.ts";

export default byMethod({
  GET: mapData(asOAuth2ClientConfig, signIn),
});
