import { useState, useEffect } from "react";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { pathParser } from "../urbit/index";
import { NotifStatus } from "../workspace/types";

function Navbar(props: {
  path: string;
  panel: string;
  openPanel: (panel: any) => void;
  notifStatus: NotifStatus;
}) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const parsed = props.path.match(pathParser);
    setOwner(parsed.groups.owner);
    setName(parsed.groups.name);
  }, [props.path]);

  function updateDocumentName(event) {
    console.log("update document name to:", event.target.value);
    // urbit call
    setName(event.target.value);
  }

  return (
    <div id="toolbar">
      <div className="azimuth mx-2">{owner}</div>
      <div
        className="mx-2 cursor-default"
        style={{ color: "var(--type-glass-color)" }}
      >
        /
      </div>
      <input
        className="flex-grow px-3 py-1 bg-none focus:outline rounded-1"
        value={name}
        style={{ outlineColor: "var(--type-color)" }}
      />
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
          props.notifStatus == NotifStatus.Both
            ? solid("bell-on")
            : props.notifStatus == NotifStatus.Stage
            ? solid("bell")
            : props.notifStatus == NotifStatus.Update
            ? regular("bell-on")
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
