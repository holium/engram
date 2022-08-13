import { useState, useMemo, useContext } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta, NotifStatus } from "./types";
import { pathParser, acknowledgeUpdate, saveDocument } from "../urbit/index";
import { UrbitContext } from "../urbit/UrbitProvider";
import * as Y from "yjs";

function Workspace(props: { path: null | string }) {
  const urbitContext = useContext(UrbitContext);

  const [documentMeta, setDocumentMeta] = useState(null);
  const [doc, setDoc] = useState(null);
  const [docType, setDocType] = useState(null);

  // Document State
  useMemo(() => {
    if (documentMeta && documentMeta != null) saveDoc();
    if (props.path == null) return;
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

  function saveDoc() {
    console.log("applying stage: ");
    // update the local document version
    const version = Y.encodeStateVector(doc);
    const content = Y.encodeStateAsUpdateV2(doc);

    // send the update to urbit
    saveDocument(
      documentMeta,
      { version: Array.from(version), content: Array.from(content) } // WIP need to be the encoded doc & the encoded update
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
        save={saveDoc}
        getStage={getStage}
        applyUpdate={applyUpdate}
        setNotifStatus={setNotifStatus}
      />
      <VersionPanel show={panel == "version"} />
      <Document type={docType} save={saveDoc} />
    </div>
  );
}

export default Workspace;
