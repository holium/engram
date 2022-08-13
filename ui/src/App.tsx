import { createContext, useState, useEffect } from "react";
import Workspace from "./components/workspace/Workspace";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/toolbar/SlideContext";
import UrbitProvider from "./components/urbit/UrbitProvider";

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
        <SlideProvider>
          <Sidebar openDoc={openDoc} />
          <Workspace path={doc} />
        </SlideProvider>
      </div>
    </UrbitProvider>
  );
}

export default App;
