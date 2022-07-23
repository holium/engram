import { createContext, useState, useEffect } from "react";
import Document from "./components/document/Document.tsx";

function App() {
  return (
    <div id="app">
      <nav></nav>
      <div id="body">
        <div id="toolbar"></div>
        <Document />
      </div>
    </div>
  );
}

export default App;
