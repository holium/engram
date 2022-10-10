import { useState, useEffect, useContext } from "react";
import { SlideContext } from "./SlideContext";
import { getDocumentSettings, renameDocument } from "../urbit/index";

function Navbar(props: {
  path: DocumentId;
  panel: string;
  openPanel: (panel: any) => void;
  notifs: boolean;
  settings: DocumentSettings;
}) {
  const { slide, setSlide } = useContext(SlideContext);
  function toggleSidebar() {
    setSlide(!slide);
  }

  return (
    <div id="toolbar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`icon clickable sidebar-toggle ${
          slide ? "sidebar-toggle-hidden" : ""
        }`}
        onClick={toggleSidebar}
        fill="var(--type-color)"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
      </svg>
      <div className="azimuth mx-2">~{props.settings.owner}</div>
      <div className="mx-2 cursor-default" style={{ opacity: ".8" }}>
        /
      </div>
      <div className="flex-grow ">{props.settings.name}</div>
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
        className="icon clickable mx-2 dim-icon"
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
          className="icon clickable mx-2 dim-icon"
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
          className="icon clickable mx-2 dim-icon"
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
      {/* Version Panel */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="var(--type-color)"
        style={
          props.panel == "version"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        className="icon clickable mx-2 dim-icon"
        onClick={() => {
          props.panel == "version"
            ? props.openPanel(null)
            : props.openPanel("version");
        }}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M7.105 15.21A3.001 3.001 0 1 1 5 15.17V8.83a3.001 3.001 0 1 1 2 0V12c.836-.628 1.874-1 3-1h4a3.001 3.001 0 0 0 2.895-2.21 3.001 3.001 0 1 1 2.032.064A5.001 5.001 0 0 1 14 13h-4a3.001 3.001 0 0 0-2.895 2.21zM6 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
      {/* Config Panel */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="var(--type-color)"
        style={
          props.panel == "config"
            ? { backgroundColor: "var(--type-glass-color)" }
            : {}
        }
        className="icon clickable mx-2 dim-icon"
        onClick={() => {
          props.panel == "config"
            ? props.openPanel(null)
            : props.openPanel("config");
        }}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
    </div>
  );
}

export default Navbar;
