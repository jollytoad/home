import { byMethod } from "$http_fns/by_method.ts";
import { signOut } from "$deno_kv_oauth/sign_out.ts";

export default byMethod({
  GET: signOut,
});
