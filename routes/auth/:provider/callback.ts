import { byMethod } from "$http_fns/method.ts";
import { mapData } from "$http_fns/map.ts";
import { asOAuth2Client } from "../_lib/oauth2_client.ts";
import { handleCallback } from "$deno_kv_oauth/handle_callback.ts";

export default byMethod({
  GET: mapData(asOAuth2Client, async (req, oauth2Client) => {
    const { response } = await handleCallback(req, oauth2Client);
    return response;
  }),
});
