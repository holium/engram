import { createContext, useState } from "react";
import { Urbit } from "@urbit/http-api";

export enum ConnectionStatus {
  Closed,
  Connecting,
  Connected,
  Retrying,
  Errored,
}

const UrbitContext = createContext({
  urbit: null,
  status: ConnectionStatus.Closed,
});

function UrbitProvider(props) {
  const win: Window & { urbit: Urbit; ship: any } = window as any;
  win.urbit = new Urbit("");
  win.urbit.ship = win.ship;

  // connection status
  const [status, setStatus] = useState(ConnectionStatus.Closed);
  win.urbit.onOpen = () => {
    console.log("urbit connection opened");
    setStatus(ConnectionStatus.Connected);
  };
  win.urbit.onRetry = () => {
    console.log("urbit connection retrying");
    setStatus(ConnectionStatus.Retrying);
  };
  win.urbit.onError = () => {
    console.log("urbit connection errored");
    setStatus(ConnectionStatus.Errored);
  };

  return (
    <UrbitContext.Provider
      value={{
        status: status,
      }}
    >
      {props.children}
    </UrbitContext.Provider>
  );
}

export default UrbitProvider;
