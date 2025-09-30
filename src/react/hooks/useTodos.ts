import { useState, useEffect, useCallback } from "react"
import type { Todo } from "../../types/todo"
import { reactTodosStore } from "../react-store"

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => reactTodosStore.getTodos())

  useEffect(() => {
    const unsubscribe = reactTodosStore.subscribe((todoList: Todo[]) => {
      setTodos(todoList)
    })
    return unsubscribe
  }, [])

  const add = useCallback((text: string) => reactTodosStore.add(text), [])
  const update = useCallback(
    (id: string, newText: string) => reactTodosStore.update(id, newText),
    []
  )
  const remove = useCallback((id: string) => reactTodosStore.remove(id), [])
  const setCompleted = useCallback(
    (id: string, value: boolean) => reactTodosStore.setCompleted(id, value),
    []
  )
  const clearCompleted = useCallback(() => reactTodosStore.clearCompleted(), [])
  const reload = useCallback(() => reactTodosStore.reload(), [])

  return {
    todos,
    add,
    update,
    remove,
    setCompleted,
    clearCompleted,
    reload,
  } as const
}
