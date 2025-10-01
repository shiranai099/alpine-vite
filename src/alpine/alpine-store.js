import Alpine from "alpinejs"
import persist from "@alpinejs/persist"
import { v4 as uuidv4 } from "uuid"

export function createAlpineStore() {
  return {
    // $persistを使用してローカルストレージと自動同期
    // 既存のReact実装と同じキーを使用して互換性を保つ
    list: Alpine.$persist([]).as("alpine_todos_v1"),

    add(text) {
      const trimmedText = text.trim()
      if (!trimmedText) return
      this.list.push({
        id: uuidv4(),
        text: trimmedText,
        completed: false,
      })
    },

    update(id, newText) {
      const item = this.list.find((todo) => todo.id === id)
      if (item) {
        item.text = newText
      }
    },

    remove(id) {
      const index = this.list.findIndex((todo) => todo.id === id)
      if (index >= 0) {
        this.list.splice(index, 1)
      }
    },

    setCompleted(id, value) {
      const item = this.list.find((todo) => todo.id === id)
      if (item) {
        item.completed = !!value
      }
    },

    clearCompleted() {
      this.list = this.list.filter((todo) => !todo.completed)
    },

    get active() {
      return this.list.filter((todo) => !todo.completed)
    },

    get completed() {
      return this.list.filter((todo) => todo.completed)
    },

    // フィルタ状態に応じたリストを返すヘルパー
    getFilteredList(filter) {
      switch (filter) {
        case "active":
          return this.active
        case "completed":
          return this.completed
        default:
          return this.list
      }
    },
  }
}

// Re-usable data
Alpine.data("todoItem", (todo) => {
  return {
    editing: false,
    tempText: todo.text,

    startEdit() {
      this.editing = true
      this.tempText = todo.text
      this.$nextTick(() => {
        if (this.$refs && this.$refs.input) {
          this.$refs.input.focus()
          this.$refs.input.select()
        }
      })
    },

    save() {
      const text = this.tempText.trim()
      if (!text) {
        this.cancel()
        return
      }
      this.$store.todos.update(todo.id, text)
      this.editing = false
    },

    cancel() {
      this.editing = false
      this.tempText = todo.text
    },
  }
})

// Alpine.jsのストアを初期化
export default function initAlpineStore() {
  Alpine.plugin(persist)
  Alpine.store("todos", createAlpineStore())
}
