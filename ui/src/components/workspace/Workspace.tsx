import { useState, useMemo, useContext } from "react";
import Document from "../document/Document";
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import { DocumentMeta, NotifStatus } from "./types";
import {
  pathParser,
  acknowledgeUpdate,
  saveDocument,
  getDocument,
} from "../urbit/index";
import { UrbitContext } from "../urbit/UrbitProvider";
import * as Y from "yjs";

function Workspace(props: { path: null | string }) {
  const urbitContext = useContext(UrbitContext);
  // Document State

  function getStage(): number {
    //return Y.encodeStateAsUpdate(doc).byteLength;
    return 0;
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
        save={/*saveDoc*/ () => {}}
        getStage={getStage}
        applyUpdate={/* applyUpdate */ () => {}}
        setNotifStatus={setNotifStatus}
      />
      <VersionPanel show={panel == "version"} />
      <Document path={props.path} />
    </div>
  );
}

export default Workspace;
