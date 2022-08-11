import { useState, useMemo, useContext } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta, NotifStatus } from "./types";
import { pathParser, acknowledgeUpdate, stageUpdate } from "../urbit/index";
import { UrbitContext } from "../urbit/UrbitProvider";
import * as Y from "yjs";

function Workspace(props: { path: null | string }) {
  const urbitContext = useContext(UrbitContext);

  const [documentMeta, setDocumentMeta] = useState(null);
  const [doc, setDoc] = useState(null);
  const [docType, setDocType] = useState(null);

  // Document State
  useMemo(() => {
    console.log(props.path);
    const parsed = props.path.match(pathParser);
    setDocumentMeta({
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    });

    console.log("doc changed to: ", props.path);
    const doc = new Y.Doc();
    if ((window as any).ship)
      doc.clientID = [...(window as any).ship].reduce(
        (acc: number, char: any) => {
          return parseInt(`${char.charCodeAt(0)}${acc}`);
        },
        0
      );
    else doc.clientID = 0;
    doc.gc = false;
    setDocType(doc.getXmlFragment("prosemirror"));
    setDoc(doc);
  }, [props.path]);

  function applyUpdate(index: number, update: Uint8Array) {
    console.log("applying update: ", update);
    // apply it to the doc
    Y.applyUpdate(doc, update);

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
    return Y.encodeStateAsUpdate(doc).byteLength;
  }

  // Open Panel
  const [panel, setPanel] = useState(null);

  // Notification Status
  const [notifStatus, setNotifStatus] = useState(NotifStatus.None);

  return props.path == null ? (
    <div id="workspace">
      <div className="flex flex-grow items-center justify-center border rounded-3">
        create a new document
      </div>
    </div>
  ) : (
    <div id="workspace">
      <Toolbar
        path={props.path}
        openPanel={setPanel}
        panel={panel}
        notifStatus={notifStatus}
      />
      <PublishPanel show={panel == "publish"} />
      <UpdatePanel
        path={props.path}
        show={panel == "update"}
        applyStage={applyStage}
        getStage={getStage}
        applyUpdate={applyUpdate}
        setNotifStatus={setNotifStatus}
      />
      <VersionPanel show={panel == "version"} />
      <Document type={docType} />
    </div>
  );
}

export default Workspace;
