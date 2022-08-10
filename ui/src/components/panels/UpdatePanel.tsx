import { useState } from "react";
import { Update } from "../workspace/types";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UpdatePanel() {
  const [changes, setChanges] = useState({ size: 123 });
  const [updates, setUpdates] = useState([
    {
      author: "~dalsyr-diglyn",
      content: new Uint8Array([1, 2, 3]),
      time: new Date(),
    },
  ]);

  return (
    <div className="panel gap-3">
      {changes.size > 0 ? (
        <div className="flex gap-3 items-center">
          <div className="flex-grow">Stage</div>
          <div>{changes.size} bytes</div>
          <FontAwesomeIcon
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
      {updates.map((update: Update) => {
        return (
          <div className="flex gap-3 items-center" key={update.time}>
            <div className="flex-grow">
              <span className="azimuth">{update.author}</span>
            </div>

            <div>{update.content.byteLength} bytes</div>
            <FontAwesomeIcon
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
