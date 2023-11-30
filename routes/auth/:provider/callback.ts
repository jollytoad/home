import { byMethod } from "$http_fns/by_method.ts";
import { mapData } from "$http_fns/map_data.ts";
import { handleCallback } from "$deno_kv_oauth/handle_callback.ts";
import { asOAuth2ClientConfig } from "../_lib/oauth_config.ts";

export default byMethod({
  GET: mapData(asOAuth2ClientConfig, async (req, oauth2Client) => {
    const { response } = await handleCallback(
      req,
      oauth2Client,
    );
    return response;
  }),
});
