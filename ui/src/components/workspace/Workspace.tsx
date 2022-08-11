import { useState, useEffect, useContext } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta, NotifStatus } from "./types";
import { pathParser, acknowledgeUpdate, stageUpdate } from "../urbit/index";
import { UrbitContext } from "../urbit/UrbitProvider";

function Workspace(props: { doc: null | string }) {
  console.log(props);
  const urbitContext = useContext(UrbitContext);

  const [documentMeta, setDocumentMeta] = useState(null);

  // Document State
  useEffect(() => {
    console.log(props.doc);
    const parsed = props.doc.match(pathParser);
    setDocumentMeta({
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    });
  }, [props.doc]);

  function applyUpdate(index: number, update: Uint8Array) {
    console.log("applying update: ", update);
    // apply it to the doc
    // Y.applyUpdate()

    // acknowledge it in urbit
    acknowledgeUpdate(documentMeta, index);
  }

  function applyStage() {
    console.log("applying stage: ");
    // update the local document version

    // send the update to urbit
    stageUpdate(
      documentMeta,
      { version: new Uint8Array([]), cont: new Uint8Array([]) }, // WIP need to be the encoded doc & the encoded update
      { author: urbitContext.ship, cont: new Uint8Array([]), time: new Date() }
    );
  }

  function getStage(): number {
    return 420;
  }

  // Open Panel
  const [panel, setPanel] = useState(null);

  // Notification Status
  const [notifStatus, setNotifStatus] = useState(NotifStatus.None);

  return props.doc == null ? (
    <div id="workspace">
      <div className="flex flex-grow items-center justify-center border rounded-3">
        create a new document
      </div>
    </div>
  ) : (
    <div id="workspace">
      <Toolbar
        doc={props.doc}
        openPanel={setPanel}
        panel={panel}
        notifStatus={notifStatus}
      />
      <PublishPanel show={panel == "publish"} />
      <UpdatePanel
        doc={props.doc}
        show={panel == "update"}
        applyStage={applyStage}
        getStage={getStage}
        applyUpdate={applyUpdate}
        setNotifStatus={setNotifStatus}
      />
      <VersionPanel show={panel == "version"} />
      <Document doc={props.doc} />
    </div>
  );
}

export default Workspace;
