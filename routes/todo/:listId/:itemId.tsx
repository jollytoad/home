import { byMethod } from "$http_fns/method.ts";
import { renderHTML } from "$http_render_fns/render_html.tsx";
import { deleteItem, writeItem } from "../_lib/data.ts";
import type { TodoListItem } from "../_lib/types.ts";
import { TodoItemView } from "../_components/TodoItemView.tsx";
import { FRAGMENT_RENDER_OPTIONS } from "@/config_fragment.ts";
import { badRequest } from "$http_fns/response/bad_request.ts";
import { seeOther } from "$http_fns/response/see_other.ts";
import { ok } from "$http_fns/response/ok.ts";
import { notFound } from "$http_fns/response/not_found.ts";

export default byMethod({
  POST: async (req: Request, match: URLPatternResult) => {
    const { listId, itemId } = match.pathname.groups;

    console.log(match);

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
        return renderHTML(TodoItemView, undefined, FRAGMENT_RENDER_OPTIONS)(
          req,
          { listId, item },
        );
      } else {
        return seeOther(match.pathname.input);
      }
    }
    return ok();
  },

  DELETE: async (req: Request, match: URLPatternResult) => {
    const { listId, itemId } = match.pathname.groups;

    if (!listId || !itemId) {
      return badRequest();
    }

    if (await deleteItem(listId, itemId)) {
      return ok("", { "HX-Reswap": "delete" });
    } else {
      return notFound();
    }
  },
});
