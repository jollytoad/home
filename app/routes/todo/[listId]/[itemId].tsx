import { deleteItem, writeItem } from "../_lib/data.ts";
import type { TodoListItem } from "../_lib/types.ts";
import { TodoItemView } from "../_components/TodoItemView.tsx";
import { badRequest } from "@http/response/bad-request";
import { seeOther } from "@http/response/see-other";
import { ok } from "@http/response/ok";
import { notFound } from "@http/response/not-found";
import { renderHtmlResponse } from "@http/html-stream/render-html-response";

export async function POST(req: Request, match: URLPatternResult) {
  const { listId, itemId } = match.pathname.groups;

  if (!listId || !itemId) {
    return badRequest();
  }

  const url = new URL(req.url);
  const form = await req.formData();
  const formCompleted = form.get("completed");
  const formText = form.get("text");

  const completed = url.searchParams.has("completed")
    ? formCompleted === "true"
    : formCompleted === "false"
    ? false
    : undefined;

  const text = typeof formText === "string" ? formText : undefined;

  const patch: Partial<TodoListItem> = {
    id: itemId,
    completed,
    text,
  };

  const item = await writeItem(listId, patch);

  if (item) {
    if (req.headers.has("HX-Request")) {
      return renderHtmlResponse(<TodoItemView listId={listId} item={item} />);
    } else {
      return seeOther(match.pathname.input);
    }
  }
  return ok();
}

export async function DELETE(_req: Request, match: URLPatternResult) {
  const { listId, itemId } = match.pathname.groups;

  if (!listId || !itemId) {
    return badRequest();
  }

  if (await deleteItem(listId, itemId)) {
    return ok("", { "HX-Reswap": "delete" });
  } else {
    return notFound();
  }
}
