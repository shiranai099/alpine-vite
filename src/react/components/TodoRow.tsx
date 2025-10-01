import { useEffect, useRef, useState } from "react"
import { Todo } from "../../types/todo"

export default function TodoRow({
  todo,
  onToggle,
  onRemove,
  onSave,
}: {
  todo: Todo
  onToggle: (v: boolean) => void
  onRemove: () => void
  onSave: (t: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [tempText, setTempText] = useState(todo.text)
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTempText(todo.text)
  }, [todo.text])

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  function cancelEdit() {
    setEditing(false)
    setTempText(todo.text)
  }

  function save() {
    const t = tempText.trim()
    if (!t) {
      cancelEdit()
      return
    }
    onSave(t)
    setEditing(false)
  }

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="text">
        {!editing ? (
          <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              ref={ref}
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save()
                if (e.key === "Escape") cancelEdit()
              }}
            />
            <button onClick={save}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        )}
      </div>
      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={onRemove}>Delete</button>
    </div>
  )
}
