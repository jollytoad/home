import type { TodoListItem } from "../_lib/types.ts";

interface Props {
  listId: string;
  item: TodoListItem;
}

export function TodoItemView({ listId, item }: Props) {
  const id = `todo-item-${listId}-${item.id}`;
  return (
    <li class="todo-item" id={id} hx-target="this" hx-swap="outerHTML">
      <input
        name="completed"
        type="checkbox"
        checked={item.completed}
        value="true"
        hx-post={`${listId}/${item.id}?completed`}
      />

      <input
        name="text"
        type="text"
        value={item.text}
        hx-post={`${listId}/${item.id}?text`}
      />

      <button hx-delete={`${listId}/${item.id}`}>Delete</button>
    </li>
  );
}

export function TodoItemBlank({ listId }: { listId: string }) {
  return (
    <li class="todo-item" hx-target="this" hx-swap="outerHTML">
      <input
        type="checkbox"
        disabled
      />

      <input
        name="text"
        type="text"
        placeholder="Add a todo item"
        autofocus
        hx-post={`${listId}`}
      />
    </li>
  );
}

export function TodoItemAdded(props: Props) {
  return (
    <>
      <TodoItemView {...props} />
      <TodoItemBlank listId={props.listId} />
    </>
  );
}
