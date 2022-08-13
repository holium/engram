import { useState, useMemo, useContext } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta, NotifStatus } from "./types";
import { pathParser, acknowledgeUpdate, saveDocument, getDocument } from "../urbit/index";
import { UrbitContext } from "../urbit/UrbitProvider";
import * as Y from "yjs";

function Workspace(props: { path: null | string }) {
  const urbitContext = useContext(UrbitContext);

  const [ready, setReady] = useState(false);
  const [documentMeta, setDocumentMeta] = useState(null);
  const [doc, setDoc] = useState(null);
  const [docType, setDocType] = useState(null);

  // Document State
  useMemo(() => {
    //if (documentMeta && documentMeta != null) saveDoc();
    if (props.path == null) return;
    setReady(false);
    const parsed = props.path.match(pathParser);
    console.log("parsed path:", parsed);
    const meta = {
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    };
    setDocumentMeta(meta);
    console.log("document meta:", meta);
      console.log("doc changed to: ", props.path);
      const doc = new Y.Doc();
      doc.clientID = (window as any).ship
      doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    setDocType(type);
    setDoc(doc);
    getDocument(meta).then((res) => {
      const version = new Uint8Array(Object.keys(res.version).map((index: any) => {
        return res.version[index]
      }));
      const content = new Uint8Array(Object.keys(res.content).map((index: any) => {
        return res.content[index]
      }));
      console.log(content);
      //const type = doc.getXmlFragment("prosemirror");
      setTimeout(() => {
        Y.applyUpdateV2(doc, content);
        console.log("after injected update", Y.encodeStateAsUpdateV2(doc));
      }, 2000);
      //setDocType(type);
      //setDoc(doc);
      console.log(doc);
      console.log(type);
      console.log("initial load", Y.encodeStateAsUpdateV2(doc));
      setReady(true);
    });
  }, [props.path]);

  function applyUpdate(index: number, update: Uint8Array) {
    console.log("applying update: ", update);
    // apply it to the doc
    Y.applyUpdateV2(doc, update);

    // acknowledge it in urbit
    acknowledgeUpdate(documentMeta, index);
  }

  function saveDoc() {
    console.log("applying stage: ");
    // update the local document version
    const version = Y.encodeStateVector(doc);
    const content = Y.encodeStateAsUpdateV2(doc);
    
    console.log(content);

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
      <Document path={props.path} />
    </div>
  );
}

export default Workspace;
