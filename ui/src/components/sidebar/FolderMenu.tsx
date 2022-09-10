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
        className="clickable"
        onClick={(e) => {
          e.stopPropagation();
          props.setCreateChild("file");
          props.ToggleFolderMenu(e);
        }}
      >
        Add File
      </li>
      <li
        className="clickable"
        onClick={(e) => {
          e.stopPropagation();
          props.setCreateChild("folder");
          props.ToggleFolderMenu(e);
        }}
      >
        Add Folder
      </li>
      <li
        className="clickable"
        clickable
        onClick={(e) => {
          props.renameFolder(true);
          props.ToggleFolderMenu(e);
        }}
      >
        Rename
      </li>
      <li
        className="clickable"
        clickable
        onClick={(e) => {
          props.onDelete(props.id);
          props.ToggleFolderMenu(e);
        }}
      >
        Delete
      </li>
    </menu>
  );
}
export default FolderMenu;
