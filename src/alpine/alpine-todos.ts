import Alpine from "alpinejs";
import type { Todo } from "../types/todo";
import { todosStore } from "../todos.logic";

// Alpine data for a single todo item (keeps the small local editing state)
Alpine.data("todoItem", (todo: Todo) => {
  return {
    editing: false,
    tempText: todo.text,

    startEdit() {
      this.editing = true;
      this.tempText = todo.text;
      (this as any).$nextTick(() => {
        if ((this as any).$refs && (this as any).$refs.input)
          (this as any).$refs.input.focus();
      });
    },

    save() {
      const t = (this.tempText || "").trim();
      if (!t) {
        this.cancel();
        return;
      }
      (this as any).$store.todos.update(todo.id, t);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
      this.tempText = todo.text;
    },
  } as any;
});

export function initTodos() {
  // Register the shared store instance with Alpine so existing templates keep working
  Alpine.store("todos", todosStore as any);
}

export default function setupAlpineTodos() {
  if ((window as any).Alpine && (window as any).Alpine.store) {
    initTodos();
  } else {
    document.addEventListener("alpine:init", () => {
      initTodos();
    });
  }
}
