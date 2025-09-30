import Alpine from "alpinejs";
import { todosStore } from "../todos.logic";

// Alpine data for a single todo item (keeps the small local editing state)
Alpine.data("todoItem", (todo) => {
  return {
    editing: false,
    tempText: todo.text,

    startEdit() {
      this.editing = true;
      this.tempText = todo.text;
      this.$nextTick(() => {
        if (this.$refs && this.$refs.input) this.$refs.input.focus();
      });
    },

    save() {
      const t = (this.tempText || "").trim();
      if (!t) {
        this.cancel();
        return;
      }
      this.$store.todos.update(todo.id, t);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
      this.tempText = todo.text;
    },
  };
});

export function initTodos() {
  Alpine.store("todos", todosStore);
}

export default function setupAlpineTodos() {
  if (window.Alpine && window.Alpine.store) {
    initTodos();
  } else {
    document.addEventListener("alpine:init", () => {
      initTodos();
    });
  }
}
