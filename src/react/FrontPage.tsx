import { useState, useRef, useEffect } from "react";
import useTodos from "./hooks/useTodos";
import type { Todo } from "../types/todo";

export default function FrontPage() {
  const { todos, add, update, remove, setCompleted, clearCompleted } =
    useTodos();
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleAdd() {
    const t = (draft || "").trim();
    if (!t) return;
    add(t);
    setDraft("");
    if (inputRef.current) inputRef.current.focus();
  }

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

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
          onKeyUp={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button onClick={handleAdd} className="input-button">
          追加
        </button>
      </div>

      <div className="controls">
        <div className="small">
          表示:
          <button
            onClick={() => setFilter("all")}
            style={{ fontWeight: filter === "all" ? 600 : 400 }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            style={{ fontWeight: filter === "active" ? 600 : 400 }}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            style={{ fontWeight: filter === "completed" ? 600 : 400 }}
          >
            Completed
          </button>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button className="clear-completed" onClick={() => clearCompleted()}>
            Clear completed
          </button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {visible.map((todo: Todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            onToggle={(v) => setCompleted(todo.id, v)}
            onRemove={() => remove(todo.id)}
            onSave={(newText) => update(todo.id, newText)}
          />
        ))}

        {todos.length === 0 && (
          <div className="small" style={{ marginTop: "0.5rem" }}>
            TODO は空です
          </div>
        )}
      </div>
    </div>
  );
}

function TodoRow({
  todo,
  onToggle,
  onRemove,
  onSave,
}: {
  todo: Todo;
  onToggle: (v: boolean) => void;
  onRemove: () => void;
  onSave: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [tempText, setTempText] = useState(todo.text);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTempText(todo.text);
  }, [todo.text]);
  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  function save() {
    const t = (tempText || "").trim();
    if (!t) {
      setEditing(false);
      setTempText(todo.text);
      return;
    }
    onSave(t);
    setEditing(false);
  }

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="text">
        {!editing ? (
          <div>
            <span className={todo.completed ? "completed" : ""}>
              {todo.text}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              ref={ref}
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") {
                  setEditing(false);
                  setTempText(todo.text);
                }
              }}
            />
            <button onClick={save}>Save</button>
            <button
              onClick={() => {
                setEditing(false);
                setTempText(todo.text);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={onRemove}>Delete</button>
    </div>
  );
}
