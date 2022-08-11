import { createContext, useState, useEffect } from "react";
import { Urbit, Patp } from "@urbit/http-api";
import * as Y from "yjs";
import {
  checkUrbitWindow,
  createDocument,
  subscribeUpdateStream,
  listDocuments,
  getDocument,
  getDocumentSettings,
  getAvailibleUpdates,
  deleteDocument,
} from "./index";
import {
  DocumentMeta,
  OpenDocumentEvent,
  ConnectionStatus,
  NotifStatus,
} from "../workspace/types";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * urbit: Urbit -- the Urbit object; used for sending pokes and scries, holds additional urbit information
 * connection: ConnectionStatus -- defaults to Closed, Connected means we're all good, Retrying and Errored may be useful for keeping the user informed
 **/

export const UrbitContext = createContext({
  urbit: null,
  connection: ConnectionStatus.Closed,
  ship: "",
});

function UrbitProvider(props: any) {
  const [showTesting, setShowTesting] = useState(true);

  // ship setup

  const win: Window & { urbit: Urbit; ship: Patp } = window as any;
  win.urbit = new Urbit("");
  if (win.ship) {
    win.urbit.ship = win.ship;
  } else {
    win.ship = "~dalsyr-diglyn";
  }
  const [ship, _] = useState(win.ship);

  const [docs, setDocs] = useState([]);

  // connection status
  const [connection, setConnectionStatus] = useState(ConnectionStatus.Closed);
  win.urbit.onOpen = () => {
    console.log("urbit connection opened");
    setConnectionStatus(ConnectionStatus.Connected);
  };
  win.urbit.onRetry = () => {
    console.log("urbit connection retrying");
    setConnectionStatus(ConnectionStatus.Retrying);
  };
  win.urbit.onError = () => {
    console.log("urbit connection errored");
    setConnectionStatus(ConnectionStatus.Errored);
  };

  // Document Status
  /*
  useEffect(() => {
    // notification status
    subscribeUpdateStream(
      props.doc,
      (event) => {
        console.log("received update: ", event);
      },
      (event) => {
        console.log("quit update subscription", event);
      },
      (e) => {
        console.log("update subscription errored: ", e);
      }
    );
    console.log("doc updated:", props.doc);
    const availibleUpdates = getAvailibleUpdates(props.doc);
    console.log(availibleUpdates);
    setUpdates([]);
  }, [props.doc]);


  // Notification status
  const [stage, setStage] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [notifs, setNotifs] = useState(NotifStatus.None);

  // keep the notif status updated
  useEffect(() => {
    if (stage && updates.length > 0) setNotifs(NotifStatus.Both);
    else if (stage) setNotifs(NotifStatus.Stage);
    else if (updates.length > 0) setNotifs(NotifStatus.Update);
    else setNotifs(NotifStatus.None);
  }, [stage, updates]);

  // register an update has been pulled
  function mergeUpdate(index: number) {
    const updt = updates[index];
    console.log("merging update: ", updt);
    const newUpdates = updates.splice(index, 1);
    setUpdates(newUpdates);
  }

  // stage an update
  function stageUpdate() {
    setStage(false);
  }

  function makeUpdate() {
    setStage(true);
  }
  */

  /* TESTING ---------------------------------------------------------------- */
  function createDoc() {
    //checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: (window as any).ship,
      id: Date.now().toString(12),
      name: "new document",
    };

    const doc = new Y.Doc();
    doc.clientID = (window as any).ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const encoding = Y.encodeStateAsUpdateV2(doc);
    /*
    createDocument(meta, encoding).then((res) => {
      console.log("create document result", res);
    });
    */
    setDocs([
      ...docs,
      {
        owner: (window as any).ship,
        id: Date.now(),
        name: "New Document",
      },
    ]);
    openDocument({
      owner: (window as any).ship,
      id: Date.now(),
      name: "New Document",
    });
  }

  function listDocs() {
    checkUrbitWindow();
    listDocuments().then((res) => {
      console.log("list documents result: ", res);
      setDocs([]);
    });
  }

  function getDoc(doc: any) {
    getDocument(doc).then((res) => {
      console.log("get doc result: ", res);
    });
  }
  function getDocSettings(doc: any) {
    getDocumentSettings(doc).then((res) => {
      console.log("get doc settings: ", res);
    });
  }
  function getDocUpdates(doc: any) {
    getAvailibleUpdates(doc).then((res) => {
      console.log("get doc updates: ", res);
    });
  }
  function deleteDoc(doc: any) {
    deleteDocument(doc).then((res) => {
      console.log("deleted document:", res);
      console.log("so this should fail:");
      getDocument(doc).then((res) => {
        console.log("this should have failed:", res);
      });
    });
  }
  function openDocument(doc: any) {
    console.log("opening doc:", doc);
    document.dispatchEvent(OpenDocumentEvent(doc));
  }

  return (
    <UrbitContext.Provider
      value={{
        // Status
        connection: connection,
        ship: ship,
      }}
    >
      <div
        className="absolute bottom-0 right-0 z-10 p-4"
        onClick={() => {
          setShowTesting(!showTesting);
        }}
      >
        <FontAwesomeIcon
          icon={regular("screwdriver-wrench")}
          className="icon"
        />
      </div>
      <div
        className={showTesting ? "absolute" : "hidden"}
        style={{ backgroundColor: "var(--paper-color)", zIndex: "3" }}
      >
        <div>connection: {ConnectionStatus[connection]}</div>

        <button className="mx-4 my-3 px-3 py-2 border" onClick={createDoc}>
          create document
        </button>
        <button className="mx-4 my-3 px-3 py-2 border" onClick={listDocs}>
          list documents
        </button>
        <ul>
          {console.log(docs)}
          {docs.map((doc) => {
            return (
              <li key={doc.id} className="flex gap-3">
                <span
                  className="font-bold cursor-pointer"
                  onClick={() => {
                    openDocument(doc);
                  }}
                >
                  {doc.name}
                </span>
                <button className="underline" onClick={getDoc(doc)}>
                  get doc
                </button>
                <button className="underline" onClick={getDocSettings(doc)}>
                  get doc settings
                </button>
                <button className="underline" onClick={getDocUpdates(doc)}>
                  get doc updates
                </button>

                <button className="underline" onClick={deleteDoc(doc)}>
                  delete document
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {props.children}
    </UrbitContext.Provider>
  );
}

export default UrbitProvider;
