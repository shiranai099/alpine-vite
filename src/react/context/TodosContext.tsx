import { createContext, useContext, useCallback, ReactNode } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import type { Todo } from "../../types/todo"
import { v4 as uuidv4 } from "uuid"

// Alpine.js側と同じローカルストレージキーを使用
const STORAGE_KEY = "alpine_todos_v1"

/**
 * Todosコンテキストの型定義
 */
interface TodosContextValue {
  todos: Todo[]
  add: (text: string) => void
  update: (id: string, newText: string) => void
  remove: (id: string) => void
  setCompleted: (id: string, completed: boolean) => void
  clearCompleted: () => void
}

const TodosContext = createContext<TodosContextValue | undefined>(undefined)

/**
 * Todosプロバイダーコンポーネント
 * アプリケーション全体でTODOの状態を管理します
 */
export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [])

  /**
   * 新しいTODOを追加
   */
  const add = useCallback(
    (text: string) => {
      if (!text || !text.trim()) return

      setTodos((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: text.trim(),
          completed: false,
        },
      ])
    },
    [setTodos]
  )

  /**
   * TODOのテキストを更新
   */
  const update = useCallback(
    (id: string, newText: string) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
      )
    },
    [setTodos]
  )

  /**
   * TODOを削除
   */
  const remove = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    },
    [setTodos]
  )

  /**
   * TODOの完了状態を設定
   */
  const setCompleted = useCallback(
    (id: string, completed: boolean) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      )
    },
    [setTodos]
  )

  /**
   * 完了済みのTODOをすべて削除
   */
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [setTodos])

  const value: TodosContextValue = {
    todos,
    add,
    update,
    remove,
    setCompleted,
    clearCompleted,
  }

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

/**
 * Todosコンテキストを使用するカスタムフック
 * @throws {Error} TodosProvider外で使用された場合
 * @returns TodosContextValue - TODOの状態と操作関数
 */
export function useTodos(): TodosContextValue {
  const context = useContext(TodosContext)
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodosProvider")
  }
  return context
}
