import { useState, useEffect } from "react";
import { Update, NotifStatus } from "../workspace/types";
import {
  pathParser,
  getAvailibleUpdates,
  subscribeUpdateStream,
  acknowledgeUpdate,
} from "../urbit/index";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          <FontAwesomeIcon
            onClick={() => {
              executeStage();
            }}
            icon={regular("check-square")}
            className="icon clickable"
          />
        </div>
      ) : (
        <div
          className="flex gap-3 items-center cursor-default"
          style={{ color: "var(--type-glass-color)" }}
        >
          <div className="flex-grow">nothing to stage...</div>
          <FontAwesomeIcon icon={regular("check-square")} className="icon" />
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
            <FontAwesomeIcon
              onClick={() => {
                executeUpdate(i);
              }}
              icon={regular("check-square")}
              className="icon clickable"
            />
          </div>
        );
      })}
    </div>
  );
}

export default UpdatePanel;
