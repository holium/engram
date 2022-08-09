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
  panel: string;
  openPanel: (panel: any) => void;
}) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");

  // Notifications
  const [stage, setStage] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const parsed = props.doc == null ? null : props.doc.match(pathParser);
    console.log("doc updated:", props.doc);
    setOwner(parsed.groups.owner);
    setName(parsed.groups.name);
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
        style={
          props.panel == "publish"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        onClick={() => {
          props.panel == "publish"
            ? props.openPanel(null)
            : props.openPanel("publish");
        }}
        icon={regular("user-group")}
        className="icon clickable mx-2"
      />
      <FontAwesomeIcon
        style={
          props.panel == "update"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        onClick={() => {
          props.panel == "update"
            ? props.openPanel(null)
            : props.openPanel("update");
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
        style={
          props.panel == "version"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        onClick={() => {
          props.panel == "version"
            ? props.openPanel(null)
            : props.openPanel("version");
        }}
        icon={regular("code-branch")}
        className="icon clickable mx-2"
      />
      <FontAwesomeIcon icon={regular("gear")} className="icon clickable mx-2" />
    </div>
  );
}

export default Navbar;
