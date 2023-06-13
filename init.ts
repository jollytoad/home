import { cors } from "$http_fns/cors.ts";
import type { ServeAhxInit } from "$ahx_fns/http/server.ts";

export default {
  interceptors: {
    response: [cors()],
  },
} satisfies ServeAhxInit;
