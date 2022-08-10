import { useState, useEffect } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta } from "./types";

function Workspace(props: { doc: null | string }) {
  console.log(props);

  const [panel, setPanel] = useState(null);

  useEffect(() => {
    console.log(props.doc);
  }, [props.doc]);

  return props.doc == null ? (
    <div id="workspace">
      <div className="flex flex-grow items-center justify-center border rounded-3">
        create a new document
      </div>
    </div>
  ) : (
    <div id="workspace">
      <Toolbar doc={props.doc} openPanel={setPanel} panel={panel} />
      {panel == "publish" && <PublishPanel />}
      {panel == "update" && <UpdatePanel />}
      {panel == "version" && <VersionPanel />}
      <Document doc={props.doc} />
    </div>
  );
}

export default Workspace;
