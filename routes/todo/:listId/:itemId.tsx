import { byMethod } from "@http/fns/by_method";
import { deleteItem, writeItem } from "../_lib/data.ts";
import type { TodoListItem } from "../_lib/types.ts";
import { TodoItemView } from "../_components/TodoItemView.tsx";
import { FRAGMENT_RENDER_OPTIONS } from "../../../config_fragment.ts";
import { badRequest } from "@http/fns/response/bad_request";
import { seeOther } from "@http/fns/response/see_other";
import { ok } from "@http/fns/response/ok";
import { notFound } from "@http/fns/response/not_found";
import { renderHTML } from "../../../lib/render_html.tsx";

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
        return renderHTML(
          TodoItemView,
          { listId, item },
          undefined,
          FRAGMENT_RENDER_OPTIONS,
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
