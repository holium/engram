import { useEffect, useRef } from "react";

function FileMenu(props) {
  const menuRef = useRef(null);

  useEffect(() => {
    console.log("menu ref:", menuRef);
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
          className="clickable"
          onClick={(e) => {
            e.stopPropagation();
            props.renameFile(true);
            props.ToggleFolderMenu(e);
          }}
        >
          Rename
        </li>
      )}
      <li
        className="clickable"
        onClick={(e) => {
          e.stopPropagation();
          props.onDelete();
          props.ToggleFolderMenu(e);
        }}
      >
        Delete
      </li>
    </menu>
  );
}
export default FileMenu;
