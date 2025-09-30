import React from "react"
import { createRoot } from "react-dom/client"
import "../common/styles.css"
import FrontPage from "./FrontPage"
import reactTodosStore from "./react-store"

try {
  reactTodosStore
} catch (e) {
  /* ignore */
}

const container = document.getElementById("root") as HTMLElement
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <FrontPage />
  </React.StrictMode>
)

export default function mount(rootEl = container) {
  return createRoot(rootEl).render(
    <React.StrictMode>
      <FrontPage />
    </React.StrictMode>
  )
}
