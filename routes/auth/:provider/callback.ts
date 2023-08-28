import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import { handleCallback } from "$deno_kv_oauth/handle_callback.ts";
import { interceptResponse } from "$http_fns/intercept.ts";
import { asOAuth2Client } from "../_lib/oauth2_client.ts";
import { deleteRedirectUrlCookie, getRedirectUrl } from "../_lib/redirect.ts";

export default byMethod({
  GET: interceptResponse(
    mapData(asOAuth2Client, async (req, oauth2Client) => {
      const { response } = await handleCallback(
        req,
        oauth2Client,
        getRedirectUrl(req),
      );
      return response;
    }),
    deleteRedirectUrlCookie,
  ),
});
