import { createContext, useState, useEffect } from "react";
import Workspace from "./components/workspace/Workspace";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/navbar/SlideContext";
import UrbitProvider from "./urbit/UrbitProvider";

function App() {
  const [doc, openDoc] = useState("~nut/00/document name");

  useEffect(() => {
    document.addEventListener("open-document", (event) => {
      console.log("open document: ", event);
      openDoc(event.details);
    });
  }, []);

  return (
    <UrbitProvider>
      <div id="app">
        <SlideProvider>
          <div id="toolbar">
            <Sidebar openDoc={openDoc} />
          </div>
          <Workspace doc={doc} />
        </SlideProvider>
      </div>
    </UrbitProvider>
  );
}

export default App;
