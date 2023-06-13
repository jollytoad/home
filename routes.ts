// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import route_1 from "./routes/index.tsx";

export default cascade(
  byPattern("/", route_1),
);
