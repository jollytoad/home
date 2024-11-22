import { Page } from "../../../components/Page.tsx";
import { renderPage } from "../../../lib/handle_page.tsx";
import type { TodoListItem } from "../_lib/types.ts";
import { writeItem } from "../_lib/data.ts";
import { TodoListView } from "../_components/TodoListView.tsx";
import { TodoItemAdded } from "../_components/TodoItemView.tsx";
import { badRequest } from "@http/response/bad-request";
import { seeOther } from "@http/response/see-other";
import { forbidden } from "@http/response/forbidden";
import { renderHtmlResponse } from "@http/html-stream/render-html-response";

export const GET = renderPage(({ req, match }) => (
  <Page req={req} module={import.meta.url}>
    <link rel="stylesheet" href="/todo/todo.css" />

    <h1>Todo List demo (work in progress)</h1>

    <TodoListView listId={match.pathname.groups.listId!} />
  </Page>
));

export async function POST(req: Request, match: URLPatternResult) {
  const { listId } = match.pathname.groups;

  if (!listId) {
    return badRequest();
  }

  const form = await req.formData();
  const formText = form.get("text");

  const completed = form.get("completed") === "true";
  const text = typeof formText === "string" ? formText : undefined;

  const patch: Partial<TodoListItem> = {
    completed,
    text,
  };

  const item = await writeItem(listId, patch);

  if (item) {
    if (req.headers.has("HX-Request")) {
      return renderHtmlResponse(<TodoItemAdded listId={listId} item={item} />);
    } else {
      return seeOther(match.pathname.input);
    }
  }

  return forbidden();
}
