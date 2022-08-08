import { createContext, useState, useEffect } from "react";
import Document from "./components/document/Document.tsx";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import { ThemeProvider } from "./background/ThemeContext";
import Background from "./background/Background";
import SlideProvider  from "./navbar/SlideContext";

function App() {
  return (
    <div id="app">
      <nav></nav>
      <div id="body">
        <SlideProvider>
        <Navbar/>
        <div id="toolbar">
          <Sidebar/>
        </div>
        </SlideProvider>
        <Document />
      </div>
    </div>
  );
}

export default App;
