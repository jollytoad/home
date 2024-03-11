import { byMethod } from "@http/fns/by_method";
import { signOut } from "$deno_kv_oauth/sign_out.ts";

export default byMethod({
  GET: signOut,
});
