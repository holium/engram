import { useEffect, useState, useRef } from "react";

function FolderMenu(props) {
  const [rename, setRename] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    if (menuRef.current && menuRef.current.focus) menuRef.current.focus();
  });

  return (
    <menu
      className="tree-menu context-menu select"
      tabIndex="0"
      ref={menuRef}
      style={{
        possition: "fixed",
        left: `${props.position.left}px`,
        top: `${props.position.top}px`,
        zIndex: "10",
        width: "240px",
      }}
      onBlur={(e) => props.ToggleFolderMenu(e)}
    >
      <li
        className="clickable flex gap-2"
        onClick={(e) => {
          e.stopPropagation();
          props.setCreateChild("file");
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
          <path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zM11 11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
        </svg>
        <div>Add New File</div>
      </li>
      <li
        className="clickable flex gap-2"
        onClick={(e) => {
          e.stopPropagation();
          props.setCreateChild("folder");
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
          <path d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM4 5v14h16V7h-8.414l-2-2H4zm7 7V9h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
        </svg>
        <div>Add New Folder</div>
      </li>
      <li
        className="clickable flex gap-2"
        clickable
        onClick={(e) => {
          props.renameFolder(true);
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
      <li
        className="clickable flex gap-2"
        clickable
        onClick={(e) => {
          props.onDelete(props.id);
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
    </menu>
  );
}
export default FolderMenu;
