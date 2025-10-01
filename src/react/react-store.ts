import type { Todo } from "../types/todo"
import { v4 as uuidv4 } from "uuid"

// Alpine.js側と同じローカルストレージキーを使用
const STORAGE_KEY = "alpine_todos_v1"

type Subscriber = (todos: Todo[]) => void

class ReactTodosStore {
  private list: Todo[] = []
  private subscribers: Subscriber[] = []

  constructor() {
    this.load()
  }

  getTodos(): Todo[] {
    return [...this.list]
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      this.list = raw ? (JSON.parse(raw) as Todo[]) : []
      if (!Array.isArray(this.list)) this.list = []
    } catch (e) {
      console.warn("Failed to load todos from localStorage:", e)
      this.list = []
    }
    this.notify()
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list))
    } catch (e) {
      console.warn("Failed to save todos to localStorage:", e)
    }
  }

  add(text: string) {
    if (!text || !text.trim()) return
    this.list.push({
      id: uuidv4(),
      text: text.trim(),
      completed: false,
    })
    this.save()
    this.notify()
  }

  update(id: string, newText: string) {
    const item = this.list.find((todo) => todo.id === id)
    if (!item) return
    item.text = newText
    this.save()
    this.notify()
  }

  remove(id: string) {
    this.list = this.list.filter((todo) => todo.id !== id)
    this.save()
    this.notify()
  }

  setCompleted(id: string, completed: boolean) {
    const item = this.list.find((todo) => todo.id === id)
    if (!item) return
    item.completed = !!completed
    this.save()
    this.notify()
  }

  clearCompleted() {
    this.list = this.list.filter((todo) => !todo.completed)
    this.save()
    this.notify()
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback)
    // 現在の状態を即座に提供
    callback(this.getTodos())

    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index >= 0) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  private notify() {
    const todos = this.getTodos()
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(todos)
      } catch (e) {
        console.warn("Subscriber error:", e)
      }
    })
  }

  // ローカルストレージの変更を外部から検出する場合に使用
  reload() {
    this.load()
  }
}

export const reactTodosStore = new ReactTodosStore()
export default reactTodosStore
