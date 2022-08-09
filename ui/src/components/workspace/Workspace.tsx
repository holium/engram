import { useState } from "react";
import Document from "../document/Document";
import Toolbar from "../navbar/Toolbar";
import { DocumentMeta } from "./types";

function Workspace(props: { doc: null | string }) {
  console.log(props);

  const [panel, setPanel] = useState(null);
  function openPanel(panel: any) {
    setPanel(panel({ openPanel: openPanel }));
  }

  return props.doc == null ? (
    <div id="workspace">
      <div className="flex flex-grow items-center justify-center border rounded-3">
        create a new document
      </div>
    </div>
  ) : (
    <div id="workspace">
      <Toolbar doc={props.doc} openPanel={openPanel} />
      {panel == null ? "" : panel}
      <Document doc={props.doc} />
    </div>
  );
}

export default Workspace;
