import { createContext, useState, useEffect } from "react";
import Document from "./components/document/Document.tsx";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import SlideProvider from "./navbar/SlideContext";
import UrbitProvider from "./urbit/UrbitProvider";

function App() {
  return (
    <UrbitProvider>
      <div id="app">
        <nav></nav>
        <div id="body">
            <SlideProvider>
              <Navbar />
              <div id="toolbar">
                <Sidebar />
              </div>
            </SlideProvider>
          <Document />
        </div>
      </div>
    </UrbitProvider>
  );
}

export default App;
