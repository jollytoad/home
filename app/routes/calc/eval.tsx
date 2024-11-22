import { handleFragment } from "../../lib/handle_fragment.tsx";
import { Evaluate, evaluatePropsFrom } from "./_components/Evaluate.tsx";

export default handleFragment(({ req }) => {
  return <Evaluate {...evaluatePropsFrom(req)} />;
});
