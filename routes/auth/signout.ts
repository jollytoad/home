import { byMethod } from "$http_fns/method.ts";
import { signOut } from "$deno_kv_oauth/sign_out.ts";
import { mapData } from "$http_fns/map.ts";

export default byMethod({
  GET: mapData(() => "/", signOut),
});
