import { createContext, useState } from "react";
import { Urbit } from "@urbit/http-api";
import * as Y from "yjs";
import {
  checkUrbitWindow,
  DocumentMeta,
  createDocument,
  subscribeUpdateStream,
  listDocuments,
  getDocument,
  getDocumentSettings,
  getAvailibleUpdates,
  deleteDocument,
} from "./index";

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

function UrbitProvider(props) {
  const win: Window & { urbit: Urbit; ship: any } = window as any;
  win.urbit = new Urbit("");
  win.urbit.ship = win.ship;

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
  subscribeUpdateStream(
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

  /* TESTING ---------------------------------------------------------------- */
  function createDoc() {
    checkUrbitWindow();
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
    createDocument(meta, encoding).then((res) => {
      console.log("create document result", res);
    });
  }

  const [docs, setDocs] = useState([]);
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

  return (
    <UrbitContext.Provider
      value={{
        status: connection,
        notifs: notifs,
      }}
    >
      <div>
        <button className="mx-4 my-3 px-3 py-2 border" onClick={createDoc}>
          create document
        </button>
        <button className="mx-4 my-3 px-3 py-2 border" onClick={listDocs}>
          list documents
        </button>
        <ul>
          {docs.map((doc) => {
            return (
              <li>
                {doc}
                <button onClick={getDoc(doc)}>get doc</button>
                <button onClick={getDocSettings(doc)}>get doc settings</button>
                <button onClock={getDocUpdates(doc)}>get doc updates</button>
                <button onClick={subscribeToUpdates(doc)}>
                  subscribe to updates
                </button>
                <button onClick={deleteDoc(doc)}>delete document</button>
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
