import { useEffect, useState } from "react";

function FolderMenu(props) {
  const [rename, setRename] = useState("");

  return (
    <menu
      className="tree-menu context-menu select"
      style={{
        left: `${props.position.left}px`,
        top: `${props.position.top}px`,
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
        onClick={() => {
          console.log(props);
          props.onDelete(props.id);
        }}
      >
        Delete
      </li>
    </menu>
  );
}
export default FolderMenu;
