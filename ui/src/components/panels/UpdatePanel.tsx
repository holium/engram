import { useState, useEffect } from "react";
import { Update, NotifStatus } from "../document/types";
import {
  pathParser,
  getAvailibleUpdates,
  subscribeUpdateStream,
  acknowledgeUpdate,
} from "../urbit/index";

function UpdatePanel(props: {
  show: boolean;
  path: string;
  getStage: () => number;
  save: () => void;
  setNotifStatus: (status: NotifStatus) => void;
  applyUpdate: (index: number, update: Uint8Array) => void;
}) {
  // Staging
  const [changes, setChanges] = useState({ size: 0, mag: "b" });
  useEffect(() => {
    setChanges(getMag(props.getStage()));
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

  function executeStage() {
    console.log("executing stage: ", changes);

    //apply the update in workspace
    props.save();

    // correct the local state
    setChanges({ size: 0, mag: "b" });
  }

  // Pulling
  const [updates, setUpdates] = useState([
    /*
    {
      author: "~dalsyr-diglyn",
      content: new Uint8Array([1, 2, 3]),
      time: new Date(),
    },
    */
  ]);

  function executeUpdate(index: number) {
    console.log("executing update: ", updates[index]);

    // apply the update in workspace
    props.applyUpdate(index, updates[index].content);

    // correct the local state
    setUpdates(updates.filter((update, i) => i != index));
  }

  return (
    <div className="panel gap-3" style={props.show ? {} : { display: "none" }}>
      {changes.size > 0 ? (
        <div className="flex gap-3 items-center">
          <div className="flex-grow">Stage</div>
          <div>
            {changes.size} {changes.mag}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="var(--type-color)"
            fill="var(--type-color)"
            onClick={() => {
              executeStage();
            }}
            className="icon clickable"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6.003 11L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
          </svg>
        </div>
      ) : (
        <div
          className="flex gap-3 items-center cursor-default"
          style={{ color: "var(--trim-color)" }}
        >
          <div className="flex-grow">nothing to stage...</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="var(--trim-color)"
            fill="var(--trim-color)"
            className="icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6.003 11L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
          </svg>
        </div>
      )}
      {updates.map((update: Update, i: number) => {
        return (
          <div className="flex gap-3 items-center" key={update.time.toString()}>
            <div className="flex-grow">
              <span className="azimuth">{update.author}</span>
            </div>

            <div>
              {getMag(update.content.byteLength).size}{" "}
              {getMag(update.content.byteLength).mag}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="var(--type-color)"
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
