import { useState, useRef, useEffect } from "react";
import NodeMenu from "./NodeMenuNode";

import { insertAtNextPossible } from "../shortcuts";

function SideMenu(props) {
  const [nodeMenu, setNodeMenu] = useState(null);
  const [pos, setPos] = useState(props.menu.pos);

  useEffect(() => {
    setPos(props.menu.pos);
  }, [props.menu.pos]);

  function openNodeMenu(event) {
    const parent = document.querySelector(".sidemenu").getBoundingClientRect();
    setNodeMenu({
      node: props.menu.node,
      to: props.menu.pos,
      from: props.menu.pos,
      left: event.clientX - parent.left,
      top: event.clientY - parent.top,
    });
  }

  function handleDrag() {
    // drag
  }

  function handleDragEnd(event) {
    const cursor = props.view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    console.log("drag ending at pos: ", cursor);
    if (cursor && cursor.pos != pos) {
      const move = insertAtNextPossible(
        props.view,
        cursor.pos,
        props.menu.node
      );
      console.log("drag move: ", move);
      if (move != null) {
        const prev = move.tr.mapping.map(pos);
        //const cleanup = props.view.state.tr.setSelection(new TextSelection(props.view.state.doc.resolve(prev + 1), props.view.state.doc.resolve(prev + props.menu.node.nodeSize - 1)))
        const cleanup = props.view.state.tr.deleteRange(
          prev,
          prev + props.menu.node.nodeSize
        );
        console.log("drag cleanup: ", cleanup);
        props.view.dispatch(cleanup);
        //toggleMark(schema.marks["strong"])(props.view.state, props.view.dispatch, props.view)
        setPos(move.pos);
      }
    }
  }

  return (
    <menu
      className="sidemenu"
      style={{
        top: `${props.menu.top - 2}px`,
        position: "absolute",
      }}
      onMouseLeave={props.hide}
    >
      {/* Plus */}
      <li onClick={openNodeMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="var(--type-color)"
          className="icon clickable"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6 6V7h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
        </svg>
      </li>
      {nodeMenu ? (
        <NodeMenu
          menu={nodeMenu}
          view={props.view}
          pos={props.menu.pos}
          hide={() => {
            setNodeMenu(null);
          }}
        />
      ) : (
        ""
      )}
      {/* Drag Handle */}
      <li draggable="true" onDrag={handleDrag} onDragEnd={handleDragEnd}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon clickable"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M11 11V5.828L9.172 7.657 7.757 6.243 12 2l4.243 4.243-1.415 1.414L13 5.828V11h5.172l-1.829-1.828 1.414-1.415L22 12l-4.243 4.243-1.414-1.415L18.172 13H13v5.172l1.828-1.829 1.415 1.414L12 22l-4.243-4.243 1.415-1.414L11 18.172V13H5.828l1.829 1.828-1.414 1.415L2 12l4.243-4.243 1.414 1.415L5.828 11z" />
        </svg>
      </li>
    </menu>
  );
}

export default SideMenu;
