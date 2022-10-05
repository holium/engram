import { useEffect, useRef } from "react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTimestamp(timestamp: Date) {
  return `${
    months[timestamp.getMonth()]
  } ${timestamp
    .getDate()
    .toString()
    .padStart(2, 0)}, ${timestamp.getFullYear()}`;
}

function FileMenu(props) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (menuRef.current && menuRef.current.focus) menuRef.current.focus();
  });

  return (
    <menu
      className="tree-menu context-menu select"
      tabIndex="0"
      style={{
        position: "fixed",
        left: `${props.position.left}px`,
        top: `${props.position.top}px`,
        zIndex: "10",
        width: "240px",
      }}
      onBlur={(e) => props.ToggleFolderMenu(e)}
      ref={menuRef}
    >
      {props.canRename && (
        <li
          className="clickable flex gap-2"
          onClick={(e) => {
            e.stopPropagation();
            props.renameFile(true);
            props.ToggleFolderMenu(e);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z" />
          </svg>
          <div>Rename</div>
        </li>
      )}
      <li
        className="clickable flex gap-2"
        onClick={(e) => {
          e.stopPropagation();
          props.onDelete();
          props.ToggleFolderMenu(e);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="var(--type-color)"
          className="icon"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" />
        </svg>
        <div>Delete</div>
      </li>
      <li
        className="flex"
        style={{ backgroundColor: "#ffffff00", cursor: "default" }}
      >
        <div className="flex-grow" style={{ opacity: ".6" }}>
          Owner:
        </div>
        <div className="azimuth">~{props.owner}</div>
      </li>
      <li
        className="flex"
        style={{ backgroundColor: "#ffffff00", cursor: "default" }}
      >
        <div className="flex-grow" style={{ opacity: ".6" }}>
          Created:
        </div>
        <div style={{ opacity: ".6" }}>
          {formatTimestamp(new Date(props.id.timestamp))}
        </div>
      </li>
    </menu>
  );
}
export default FileMenu;
