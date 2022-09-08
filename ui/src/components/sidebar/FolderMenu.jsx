import { useEffect, useState } from "react";

function FolderMenu(props) {
  const [rename, setRename] = useState("");

  return (
    <menu
      className="tree-menu context-menu select"
      style={{
        left: `${props.position.left}px`,
        top: `${props.position.top}px`,
        zIndex: "10",
        width: "240px",
      }}
      onMouseLeave={(e) => props.ToggleFolderMenu(e)}
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
