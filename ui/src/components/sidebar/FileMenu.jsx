import { useEffect, useState } from "react";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FileMenu(props) {
  return (
    <menu
      className=" tree-menu context-menu select"
      style={{
        left: `${props.position.left}px`,
        top: `${props.position.top}px`,
        zIndex: "10",
      }}
      onMouseLeave={(e) => props.ToggleFolderMenu(e)}
    >
      <li
        className="justify-center clickable"
        onClick={(e) => {
          e.stopPropagation();
          props.renameFolder(true);
          props.ToggleFolderMenu(e);
        }}
      >
        Rename
      </li>
      <li
        className="justify-center clickable"
        onClick={(e) => {
          e.stopPropagation();
          props.onDelete();
        }}
      >
        Delete
      </li>
    </menu>
  );
}
export default FileMenu;
