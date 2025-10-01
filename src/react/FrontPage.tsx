import { useState, useRef, useMemo, useEffect } from "react"
import type { Filter } from "../types/todo"
import TodoRow from "./components/TodoRow"
import { useTodos } from "./context/TodosContext"

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
]

export default function FrontPage() {
  const { todos, add, update, remove, setCompleted, clearCompleted } =
    useTodos()
  const [draft, setDraft] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleAdd() {
    const t = draft.trim()
    if (!t) return
    add(t)
    setDraft("")
    inputRef.current?.focus()
  }

  const visible = useMemo(() => {
    return todos.filter((t) => {
      if (filter === "all") return true
      if (filter === "active") return !t.completed
      return t.completed
    })
  }, [todos, filter])

  return (
    <div>
      <h1>React TODO</h1>

      <div className="input-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="新しいTODOを入力して Enter"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd()
          }}
        />
        <button onClick={handleAdd} className="input-button">
          追加
        </button>
      </div>

      <div className="controls">
        <div className="small">
          表示:
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              style={{ fontWeight: filter === value ? 600 : 400 }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="clear-completed" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {visible.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            onToggle={(v) => setCompleted(todo.id, v)}
            onRemove={() => remove(todo.id)}
            onSave={(newText) => update(todo.id, newText)}
          />
        ))}

        {visible.length === 0 && (
          <div className="small" style={{ marginTop: "0.5rem" }}>
            {todos.length === 0 ? "TODO は空です" : "該当するTODOがありません"}
          </div>
        )}
      </div>
    </div>
  )
}
