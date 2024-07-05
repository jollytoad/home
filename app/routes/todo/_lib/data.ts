import { filterValues } from "@std/collections/filter-values";
import type { TodoListItem } from "./types.ts";
import { getItem, listItems, removeItem, setItem } from "@jollytoad/store";
import { newId } from "./id.ts";

export async function* readItems(listId: string): AsyncIterable<TodoListItem> {
  for await (
    const [_key, item] of listItems<TodoListItem>(itemKeyPrefix(listId))
  ) {
    yield item;
  }
}

export async function writeItem(
  listId: string,
  item: Partial<TodoListItem>,
): Promise<TodoListItem | undefined> {
  const patch: Partial<TodoListItem> = filterValues(
    item,
    (value) => value !== undefined,
  );

  if (item.id) {
    const existingItem = await getItem<TodoListItem>(itemKey(listId, item.id));

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        ...patch,
        updatedAt: Date.now(),
      };

      await setItem(itemKey(listId, item.id), updatedItem);

      return updatedItem;
    }
  } else {
    const id = newId();

    const newItem: TodoListItem = {
      id,
      completed: patch.completed ?? false,
      text: patch.text ?? "",
      createdAt: Date.now(),
    };

    await setItem(itemKey(listId, id), newItem);

    return newItem;
  }
}

export async function deleteItem(
  listId: string,
  itemId: string,
): Promise<boolean> {
  await removeItem(itemKey(listId, itemId));
  return true;
}

function itemKeyPrefix(listId: string) {
  return ["todo", listId, "item"];
}

function itemKey(listId: string, itemId: string) {
  return [...itemKeyPrefix(listId), itemId];
}
