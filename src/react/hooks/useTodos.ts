import { useState, useEffect, useCallback } from "react";
import type { Todo } from "../../types/todo";
import { todosStore } from "../../todos.logic";

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    todosStore.list ? todosStore.list.slice() : []
  );

  useEffect(() => {
    const unsub = todosStore.subscribe((list: Todo[]) => {
      setTodos(Array.isArray(list) ? list.slice() : []);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const add = useCallback((text: string) => todosStore.add(text), []);
  const update = useCallback(
    (id: string, newText: string) => todosStore.update(id, newText),
    []
  );
  const remove = useCallback((id: string) => todosStore.remove(id), []);
  const setCompleted = useCallback(
    (id: string, value: boolean) => todosStore.setCompleted(id, value),
    []
  );
  const clearCompleted = useCallback(() => todosStore.clearCompleted(), []);
  const reload = useCallback(() => todosStore.load(), []);

  return {
    todos,
    add,
    update,
    remove,
    setCompleted,
    clearCompleted,
    reload,
  } as const;
}
