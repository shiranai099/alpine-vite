import Alpine from "alpinejs";
import setupAlpineTodos from "./alpine-todos";

declare global {
  interface Window {
    Alpine?: typeof Alpine;
  }
}

window.Alpine = Alpine;
// Alpine store registration must happen before Alpine.start()
setupAlpineTodos();
Alpine.start();

export {};
