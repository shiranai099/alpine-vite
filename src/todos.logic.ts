import type { Todo } from "./types/todo";

// Keep compatibility with existing storage key used by the Alpine code
const STORAGE_KEY = "alpine_todos_v1";

type Subscriber = (todos: Todo[]) => void;

function makeId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

const subscribers: Subscriber[] = [];

export const todosStore = {
  list: [] as Todo[],
  storageKey: STORAGE_KEY,

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.list = raw ? (JSON.parse(raw) as Todo[]) : [];
      if (!Array.isArray(this.list)) this.list = [];
    } catch (e) {
      console.warn("Failed to load todos from localStorage:", e);
      this.list = [];
    }
    this.notify();
  },

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.list));
    } catch (e) {
      console.warn("Failed to save todos to localStorage:", e);
    }
  },

  add(text: string) {
    if (!text || !text.trim()) return;
    this.list.push({ id: makeId(), text: text.trim(), completed: false });
    this.save();
    this.notify();
  },

  update(id: string, newText: string) {
    const item = this.list.find((i) => i.id === id);
    if (!item) return;
    item.text = newText;
    this.save();
    this.notify();
  },

  remove(id: string) {
    this.list = this.list.filter((i) => i.id !== id);
    this.save();
    this.notify();
  },

  setCompleted(id: string, value: boolean) {
    const item = this.list.find((i) => i.id === id);
    if (!item) return;
    item.completed = !!value;
    this.save();
    this.notify();
  },

  clearCompleted() {
    this.list = this.list.filter((i) => !i.completed);
    this.save();
    this.notify();
  },

  subscribe(cb: Subscriber) {
    subscribers.push(cb);
    // call immediately to provide current state
    cb(this.list);
    return () => {
      const idx = subscribers.indexOf(cb);
      if (idx >= 0) subscribers.splice(idx, 1);
    };
  },

  notify() {
    subscribers.forEach((s) => {
      try {
        s(this.list);
      } catch (e) {
        console.warn("Subscriber error:", e);
      }
    });
  },
};

export default todosStore;
