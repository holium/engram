import { createContext, useState } from "react";
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
  saveDocument,
} from "./index";
import {
  DocumentMeta,
  OpenDocumentEvent,
  ConnectionStatus,
  NotifStatus,
} from "../document/types";

/**
 * urbit: Urbit -- the Urbit object; used for sending pokes and scries, holds additional urbit information
 * connection: ConnectionStatus -- defaults to Closed, Connected means we're all good, Retrying and Errored may be useful for keeping the user informed
 **/

export const UrbitContext = createContext({
  connection: ConnectionStatus.Closed,
  ship: "",
});

function UrbitProvider(props: any) {
  // ship setup

  const win: Window & { urbit: Urbit; ship: Patp } = window as any;
  win.urbit = new Urbit("");
  if (win.ship) {
    win.urbit.ship = win.ship;
  } else {
    win.ship = "dalsyr-diglyn";
  }
  const [ship, _] = useState(win.ship);

  // connection status
  const [connection, setConnectionStatus] = useState(ConnectionStatus.Closed);
  win.urbit.onOpen = () => {
    console.log("urbit connection opened");
    setConnectionStatus(ConnectionStatus.Connected);
  };
  win.urbit.onRetry = () => {
    console.warn("urbit connection retrying");
    setConnectionStatus(ConnectionStatus.Retrying);
  };
  win.urbit.onError = () => {
    console.warn("urbit connection errored");
    setConnectionStatus(ConnectionStatus.Errored);
  };

  return (
    <UrbitContext.Provider
      value={{
        // Status
        connection: connection,
        ship: ship,
      }}
    >
      {props.children}
    </UrbitContext.Provider>
  );
}

export default UrbitProvider;
