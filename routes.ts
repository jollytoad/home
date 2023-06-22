// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import route_1 from "./routes/quiz.tsx";
import route_2 from "./routes/blog/:path*.tsx";
import route_3 from "./routes/async.tsx";
import route_4 from "./routes/answer/:id/:answer.tsx";
import route_5 from "./routes/index.tsx";

export default cascade(
  byPattern("/quiz", route_1),
  byPattern("/blog/:path*", route_2),
  byPattern("/async", route_3),
  byPattern("/answer/:id/:answer", route_4),
  byPattern("/", route_5),
);
