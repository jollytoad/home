import { handleFragment } from "../../lib/handle_fragment.ts";
import { UserWidget } from "../../components/UserWidget.tsx";

export default handleFragment(({ req }) => {
  return <UserWidget req={req} />;
});
