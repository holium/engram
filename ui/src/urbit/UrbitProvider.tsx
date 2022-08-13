import { createContext, useState } from "react";
import { Urbit } from "@urbit/http-api";
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
import { DocumentMeta, OpenDocumentEvent } from "../components/workspace/types";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum ConnectionStatus {
  Closed,
  Connecting,
  Connected,
  Retrying,
  Errored,
}

export enum NotifStatus {
  None,
  Stage,
  Update,
  Both,
}

const UrbitContext = createContext({
  urbit: null,
  connection: ConnectionStatus.Closed,
  notifs: false,
});

function UrbitProvider(props: any) {
  const [showTesting, setShowTesting] = useState(true);

  const win: Window & { urbit: Urbit; ship: any } = window as any;
  win.urbit = new Urbit("");
  if (win.ship) {
    win.urbit.ship = win.ship;
  } else {
    win.ship = "~dalsyr-diglyn";
  }

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

  // notification status
  const [notifs, setNotifStatus] = useState(NotifStatus.None);

  /* TESTING ---------------------------------------------------------------- */
  function createDoc() {
    //checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: `~${(window as any).ship}`,
      id: `~${(window as any).ship}-${crypto.randomUUID()}`,
      name: "new document",
    };

    const doc = new Y.Doc();
    doc.clientID = (window as any).ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const version = Y.encodeStateVector(doc)
    const encoding = Y.encodeStateAsUpdateV2(doc);
    
    createDocument(meta,  { version: Array.from(version), content: Array.from(encoding) }).then((res) => {
      console.log("create document result", res);
    });
  }

  function listDocs() {
    checkUrbitWindow();
    listDocuments().then((res) => {
      console.log("list documents result: ", res);
      setDocs(Object.keys(res).map((key) => {
        return { id: key, owner: "~" + res[key].owner, name: res[key].name }
      }));
    });
  }

  function getDoc(doc: DocumentMeta) {
    getDocument(doc).then((res) => {
      console.log("get doc result: ", res);
    });
  }
  /*
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
  */
  function deleteDoc(doc: any) {
    deleteDocument(doc).then((res) => {
      console.log("deleted document:", res);
      console.log("so this should fail:");
      getDocument(doc).then((res) => {
        console.log("this should have failed:", res);
      });
    });
  }
  /*
  function subscribeToUpdates(doc: any) {
    subscribeUpdateStream(
      (event) => {
        console.log("recieived update: ", event, " for document ", doc);
      },
      (event) => {
        console.log("quitting update subscription to: ", doc);
      },
      (e) => {
        console.warn("error with update subscription to: ", doc);
      }
    ).then((res) => {
      console.log("subscrition result: ", res);
    });
  }
  function openDocument(doc: any) {
    console.log("opening doc:", doc);
    document.dispatchEvent(OpenDocumentEvent(doc));
  }
  */

  return (
    <UrbitContext.Provider
      value={{
        connection: connection,
        notifs: notifs,
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
        <div>updates: {NotifStatus[notifs]}</div>
        <button className="mx-4 my-3 px-3 py-2 border" onClick={createDoc}>
          create document
        </button>
        <button className="mx-4 my-3 px-3 py-2 border" onClick={listDocs}>
          list documents
        </button>
        <ul>
          {docs.map((doc) => {
            return (
              <li key={doc.id} className="flex gap-3">
                <span
                  className="font-bold cursor-pointer"
                  onClick={() => {
                    openDocument(doc);
                  }}
                >
                  {doc.name} {doc.owner} {doc.id}
                </span>
                
                <button className="underline" onClick={() => {getDoc(doc)}}>
                  get doc
                </button>
		
                <button className="underline" onClick={() => {getDocSettings(doc)}}>
                  get doc settings
                </button>
                <button className="underline" onClick={() => {getDocUpdates(doc)}}>
                  get doc updates
                </button>
                <button className="underline" onClick={() => {subscribeToUpdates(doc)}}>
                  subscribe to updates
                </button>
		
                <button className="underline" onClick={() => {deleteDoc(doc)}}>
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
