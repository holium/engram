import { createContext, useState, useEffect } from "react";
import Document from "./components/document/Document.tsx";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/navbar/SlideContext";
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
