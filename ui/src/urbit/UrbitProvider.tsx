import { createContext, useState } from "react";
import { Urbit } from "@urbit/http-api";
import {
  checkUrbitWindow,
  DocumentMeta,
  createDocument,
  subscribeUpdateStream,
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
  function createDocument() {
    checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: (window as any).ship,
      id: Date.now().toString(12),
      name: "new document",
    };
  }

  function listDocuments() {
    checkUrbitWindow();
    const res = listDocuments();
    console.log("Listed documents:", res);
  }

  return (
    <UrbitContext.Provider
      value={{
        status: connection,
        notifs: notifs,
      }}
    >
      <div>
        <button onClick={createDocument}>create document</button>
        <button onCLick={listDocuments}>list documents</button>
      </div>
      {props.children}
    </UrbitContext.Provider>
  );
}

export default UrbitProvider;
