import { useState, useEffect } from "react";

import { SlideContext } from "./SlideContext";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import PublishPanel from "../panels/PublishPanel";

import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAvailibleUpdates } from "../../urbit/index";

const pathParser = new RegExp("(?<owner>[^/]+)/(?<id>[^/]+)/(?<name>[^/]+)");

function Navbar(props: {
  doc: null | string;
  openPanel: (panel: any) => void;
}) {
  const parsed = props.doc == null ? null : props.doc.match(pathParser);

  const [owner, setOwner] = useState(parsed == null ? "" : parsed.groups.owner);
  const [name, setName] = useState(parsed == null ? "" : parsed.groups.name);

  // Notifications
  const [stage, setStage] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    console.log("doc updated:", props.doc);
    getAvailibleUpdates(props.doc);
  }, [props.doc]);

  return (
    <div id="toolbar">
      <div className="azimuth mx-2">{owner}</div>
      <div
        className="mx-2 cursor-default"
        style={{ color: "var(--type-glass-color)" }}
      >
        /
      </div>
      <div className="flex-grow mx-2">{name}</div>
      <FontAwesomeIcon
        onClick={() => {
          props.openPanel(PublishPanel);
        }}
        icon={regular("user-group")}
        className="icon clickable mx-2"
      />
      <FontAwesomeIcon
        onClick={() => {
          props.openPanel(UpdatePanel);
        }}
        icon={
          stage
            ? updates.length > 0
              ? solid("bell-on")
              : regular("bell-on")
            : updates.length > 0
            ? solid("bell")
            : regular("bell")
        }
        className="icon clickable mx-2"
      />
      <FontAwesomeIcon
        onClick={() => {
          props.openPanel(VersionPanel);
        }}
        icon={regular("code-branch")}
        className="icon clickable mx-2"
      />
      <FontAwesomeIcon icon={regular("gear")} className="icon clickable mx-2" />
    </div>
  );
}

export default Navbar;
