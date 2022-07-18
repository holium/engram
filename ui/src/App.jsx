import { createContext } from "react"
import Document from "./components/document/Document.tsx";
import ThemeConfig from "./config.ts"

export const ThemeContext = createContext({
  theme: new ThemeConfig({}),
  setConfigItem: (key, value) => {}
})

function App() {

  const state = {
    theme: new ThemeConfig({}),
    setConfigItem: (key, value) => {
      console.log("does this run?")
      state.theme.config[key].value = value;
    }
  };

  return (
    <div id="app">
      <ThemeContext.Provider value={state}>
        <Document />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
