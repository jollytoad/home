import { handleFragment } from "@/lib/route.ts";
import { Evaluate, evaluatePropsFrom } from "@/components/Evaluate.tsx";

export default handleFragment(({ req }) => {
  return <Evaluate {...evaluatePropsFrom(req)} />;
});
