import { createContext, useState, useEffect } from "react";
import Document from "./components/document/Document.tsx";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import { ThemeProvider } from "./background/ThemeContext";
import Background from "./background/Background";

function App() {
  return (
    <div id="app">
      <nav></nav>
      <div id="body">
        <ThemeProvider>
        <Navbar/>
        <div className= " flex" id="toolbar">
          <Sidebar/>
        </div>
        </ThemeProvider>
        <Document />
      </div>
    </div>
  );
}

export default App;
