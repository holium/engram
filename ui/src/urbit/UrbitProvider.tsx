import { createContext, useState } from "react";
import { Urbit } from "@urbit/http-api";
import * as Y from "yjs";
import {
  checkUrbitWindow,
  DocumentMeta,
  createDocument,
  subscribeUpdateStream,
  listDocuments,
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

  function listDocs() {
    checkUrbitWindow();
    listDocuments().then((res) => {
      console.log("list documents result: ", res);
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
      </div>
      {props.children}
    </UrbitContext.Provider>
  );
}

export default UrbitProvider;
