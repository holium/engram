import { useState, useEffect, useContext } from "react";
import { pathParser } from "../urbit/index";
import { NotifStatus } from "../document/types";
import { SlideContext } from "./SlideContext";

function Navbar(props: {
  path: string;
  panel: string;
  openPanel: (panel: any) => void;
  notifs: boolean;
}) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const { slide, setSlide } = useContext(SlideContext);

  useEffect(() => {
    const parsed = props.path.match(pathParser);
    setOwner(parsed.groups.owner);
    setName(parsed.groups.name);
  }, [props.path]);

  function updateDocumentName(event: any) {
    console.log("update document name to:", event.target.value);
    // urbit call
    setName(event.target.value);
  }

  function toggleSidebar() {
    setSlide(!slide);
  }

  return (
    <div id="toolbar">
      <div onClick={toggleSidebar}>toggle sidebar</div>
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
        onChange={(event) => {
          setName(event.target.value);
        }}
        style={{ outlineColor: "var(--type-color)" }}
        onBlur={updateDocumentName}
      />
      {/* Sharing */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="var(--type-color)"
        style={
          props.panel == "publish"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        className="icon clickable mx-2"
        onClick={() => {
          props.panel == "publish"
            ? props.openPanel(null)
            : props.openPanel("publish");
        }}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z" />
      </svg>
      {props.notifs ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon clickable mx-2"
          fill="var(--type-color)"
          onClick={() => {
            props.panel == "update"
              ? props.openPanel(null)
              : props.openPanel("update");
          }}
          style={
            props.panel == "update"
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zM9 21h6v2H9v-2z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon clickable mx-2"
          fill="var(--type-color)"
          onClick={() => {
            props.panel == "update"
              ? props.openPanel(null)
              : props.openPanel("update");
          }}
          style={
            props.panel == "update"
              ? { backgroundColor: "var(--type-glass-color)" }
              : {}
          }
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z" />
        </svg>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="var(--type-color)"
        style={
          props.panel == "version"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        className="icon clickable mx-2"
        onClick={() => {
          props.panel == "version"
            ? props.openPanel(null)
            : props.openPanel("version");
        }}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M7.105 15.21A3.001 3.001 0 1 1 5 15.17V8.83a3.001 3.001 0 1 1 2 0V12c.836-.628 1.874-1 3-1h4a3.001 3.001 0 0 0 2.895-2.21 3.001 3.001 0 1 1 2.032.064A5.001 5.001 0 0 1 14 13h-4a3.001 3.001 0 0 0-2.895 2.21zM6 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
    </div>
  );
}

export default Navbar;
