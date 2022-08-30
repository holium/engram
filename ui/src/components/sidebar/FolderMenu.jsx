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
        className="justify-center clickable"
        onClick={(e) => (e.stopPropagation(), props.setCreateName(true))}
      >
        Add File
      </li>
      <li
        className="justify-center clickable"
        onClick={(e) => (e.stopPropagation(), props.setCreateChild(true))}
      >
        Add Folder
      </li>
      <li
        className="justify-center clickable"
        onClick={(e) => {
          props.renameFolder(true);
          props.ToggleFolderMenu(e);
        }}
      >
        Rename
      </li>
      <li
        className="justify-center"
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
