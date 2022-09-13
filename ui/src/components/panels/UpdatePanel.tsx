import { useState, useEffect } from "react";
import { Update, NotifStatus } from "../document/types";
import * as Y from "yjs";
import {
  getDocumentSettings,
  getDocumentUpdates,
  subscribeToRemoteDocument,
  unsubscribeFromRemoteDocument,
  acknowledgeUpdate,
  recordSnapshot,
} from "../urbit/index";

function UpdatePanel(props: {
  show: boolean;
  path: DocumentId;
  getStage: () => number;
  save: () => void;
  setNotifStatus: (status: NotifStatus) => void;
  applyUpdate: (index: number, update: Uint8Array) => Uint8Array;
}) {
  // Staging
  const [changes, setChanges] = useState({ size: 0, mag: "b" });
  const [updates, setUpdates] = useState([]);
  const [activeSubs, setActiveSubs] = useState([]);

  useEffect(() => {
    activeSubs.forEach((sub) => {
      unsubscribeFromRemoteDocument(sub);
    });
    setActiveSubs([]);
    getDocumentSettings(props.path).then((res) => {
      console.log("Get document settings result: ", res);
      Object.values(res.whitelist).map((member) => {
        if (member != (window as any).ship) {
          subscribeToRemoteDocument(member, props.path);
          setActiveSubs([...activeSubs, member]);
        }
      });
    });
  }, [props.path]);

  useEffect(() => {
    setChanges(getMag(props.getStage()));

    getDocumentUpdates(props.path).then((res) => {
      console.log("get document updates result", res);

      setUpdates([
        ...Object.values(res).map((update) => {
          return {
            author: update.author,
            timestamp: new Date(update.timestamp),
            content: new Uint8Array(JSON.parse(update.content)),
          };
        }),
      ]);
    });
  }, [props.show]);

  function getMag(bytes: number): { size: number; mag: string } {
    const exp = Math.log10(bytes);
    const mag =
      exp < 3 ? "b" : exp < 6 ? "kb" : exp < 9 ? "mb" : exp < 12 ? "gb" : "tb";
    return {
      size: Math.floor(bytes / 10 ** (3 * Math.floor(exp / 3))),
      mag: mag,
    };
  }

  function executeUpdate(index: number) {
    console.log("Executing update: ", updates[index]);

    // apply the update in workspace
    const doc = props.applyUpdate(
      updates[index].content,
      updates[index].author
    );
    acknowledgeUpdate(props.path, updates[index]);

    // correct the local state
    setUpdates(updates.filter((update, i) => i != index));
  }

  return (
    <div className="panel gap-3" style={props.show ? {} : { display: "none" }}>
      {updates.length == 0 ? (
        <div className="flex gap-3 items-center">
          <div className="flex-grow">No Updates</div>
        </div>
      ) : (
        ""
      )}
      {updates.map((update: Update, i: number) => {
        return (
          <div
            className="flex gap-3 items-center"
            key={update.timestamp.toString()}
          >
            <div className="flex-grow">
              <span className="azimuth">~{update.author}</span>
            </div>

            <div>
              {getMag(update.content.byteLength).size}
              {getMag(update.content.byteLength).mag}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="var(--type-color)"
              onClick={() => {
                executeUpdate(i);
              }}
              className="icon clickable"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6.003 11L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default UpdatePanel;
