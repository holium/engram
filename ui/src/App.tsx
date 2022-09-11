import { useState, useEffect } from "react";
import Workspace from "./components/document/Workspace";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/toolbar/SlideContext";
import UrbitProvider from "./components/urbit/UrbitProvider";
import { pathParser } from "./components/document/types";

function App() {
  const [path, openDoc] = useState(null);

  useEffect(() => {
    document.addEventListener("open-document", (event) => {
      const parsed = (event as CustomEvent).detail.match(pathParser);
      console.log("parsed:", parsed);
      openDoc({
        id: parsed.groups.id,
        timestamp: parseInt(parsed.groups.timestamp),
      });
    });
  }, []);

  return (
    <UrbitProvider>
      <div id="app">
        <SlideProvider>
          <Sidebar />
          <Workspace path={path} />
        </SlideProvider>
      </div>
    </UrbitProvider>
  );
}

export default App;
