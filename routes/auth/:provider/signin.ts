import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import { signIn } from "$deno_kv_oauth/sign_in.ts";
import { interceptResponse } from "$http_fns/intercept.ts";
import { asOAuth2Client } from "../_lib/oauth2_client.ts";
import { setRedirectUrlCookie } from "../_lib/redirect.ts";

export default byMethod({
  GET: interceptResponse(
    mapData(asOAuth2Client, signIn),
    setRedirectUrlCookie,
  ),
});
