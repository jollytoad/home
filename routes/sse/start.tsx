import { handleFragment } from "@/lib/handle_fragment.ts";

export default handleFragment(() => {
  return (
    <div
      id="control"
      hx-ext="sse"
      sse-connect="/sse/feed"
      sse-swap="message"
      hx-target="#output"
      hx-swap="beforeend"
    >
      Feed in progress
    </div>
  );
});
