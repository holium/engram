import { useState, useEffect } from "react";
import Workspace from "./components/document/Workspace";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/toolbar/SlideContext";
import UrbitProvider from "./components/urbit/UrbitProvider";
import Debuger from "./components/Debuger";

function App() {
  const [doc, openDoc] = useState(null);

  useEffect(() => {
    document.addEventListener("open-document", (event) => {
      console.log("open document: ", event);
      openDoc((event as CustomEvent).detail);
    });
  }, []);

  return (
    <UrbitProvider>
      <div id="app">
        {/*
        <SlideProvider>
          <Sidebar />
          <Workspace path={doc} />
        </SlideProvider>
      */}

        <Debuger />
      </div>
    </UrbitProvider>
  );
}

export default App;
