export type Filter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodosStore {
  list: Todo[];
  storageKey: string;
  makeId?(): string;
  load(): void;
  save(): void;
  add(text: string): void;
  update(id: string, newText: string): void;
  remove(id: string): void;
  setCompleted(id: string, value: boolean): void;
  clearCompleted(): void;
}
