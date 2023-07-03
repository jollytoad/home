import { handleFragment } from "@/lib/route.ts";
import { getSearchValues } from "$http_fns/request.ts";
import { Evaluate } from "@/components/Evaluate.tsx";

export default handleFragment(({ req }) => {
  const expr = getSearchValues(req)("expr")[0] ?? "";

  return <Evaluate expr={expr} />;
});
