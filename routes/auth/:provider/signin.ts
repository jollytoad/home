import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import { asOAuth2Client } from "../_lib/oauth2_client.ts";
import { signIn } from "$deno_kv_oauth/sign_in.ts";

export default byMethod({
  GET: mapData(asOAuth2Client, signIn),
});
