import React from "react"
import { createRoot } from "react-dom/client"
import "../common/styles.css"
import FrontPage from "./FrontPage"
import { TodosProvider } from "./context/TodosContext"

const container = document.getElementById("root") as HTMLElement
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <TodosProvider>
      <FrontPage />
    </TodosProvider>
  </React.StrictMode>
)
