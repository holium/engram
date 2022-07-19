import { createContext, useState, useEffect } from "react"
import Document from "./components/document/Document.tsx";
import ThemeConfig from "./components/config/config.ts"

export const ThemeContext = createContext()

function App() {
  const theme = new ThemeConfig({})

  return (
    <div id="app">
      <ThemeContext.Provider value={theme}>
        <Document />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
