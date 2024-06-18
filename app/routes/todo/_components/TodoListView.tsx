import type { TodoListItem } from "../_lib/types.ts";
import { TodoItemBlank, TodoItemView } from "../_components/TodoItemView.tsx";
import { readItems } from "../_lib/data.ts";

export function TodoListView({ listId }: { listId: string }) {
  return (
    <ol>
      <TodoListItemsView listId={listId} items={readItems(listId)} />
      <TodoItemBlank listId={listId} />
    </ol>
  );
}

async function* TodoListItemsView(
  { items, listId }: { items: AsyncIterable<TodoListItem>; listId: string },
) {
  for await (const item of items) {
    yield <TodoItemView listId={listId} item={item} />;
  }
}
