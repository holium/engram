import { useState, useEffect } from "react";
import Workspace from "./components/document/Workspace";
import Sidebar from "./components/sidebar/Sidebar";
import SlideProvider from "./components/toolbar/SlideContext";
import UrbitProvider from "./components/urbit/UrbitProvider";
import { pathParser } from "./components/document/types";

function App() {
  const [path, openDoc] = useState(null);
  const [addDoc, setAddDoc] = useState(null);

  useEffect(() => {
    document.addEventListener("open-document", (event) => {
      console.log(event.detail);
      const parsed = (event as CustomEvent).detail.match(pathParser);
      console.log("parsed:", parsed);
      (window as any).urbit.reset();
      if (parsed.groups.ship.length > 0) {
        console.log("adding doc");
        setAddDoc({
          ship: parsed.groups.ship,
          id: parsed.groups.id,
          timestamp: parseInt(parsed.groups.timestamp),
        });
      } else {
        openDoc({
          id: parsed.groups.id,
          timestamp: parseInt(parsed.groups.timestamp),
        });
      }
    });
  }, []);

  return (
    <UrbitProvider>
      <div id="app">
        <SlideProvider>
          <Sidebar addDoc={addDoc} />
          <Workspace path={path} />
        </SlideProvider>
      </div>
    </UrbitProvider>
  );
}

export default App;
