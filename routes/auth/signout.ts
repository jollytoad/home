import { byMethod } from "$http_fns/method.ts";
import { signOut } from "$deno_kv_oauth/sign_out.ts";

export default byMethod({
  GET: signOut,
});
