import { useState, useRef, useEffect } from "react";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NodeMenu from "./NodeMenuNode";

import { TextSelection } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import schema from "../../build/schema";
import { insertAtNextPossible } from "../shortcuts";

function SideMenu(props) {
  const menuButton = useRef();
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
    if (cursor && cursor.pos != pos) {
      const move = insertAtNextPossible(
        props.view,
        cursor.pos,
        props.menu.node
      );
      if (move != null) {
        const prev = move.tr.mapping.map(pos);
        //const cleanup = props.view.state.tr.setSelection(new TextSelection(props.view.state.doc.resolve(prev + 1), props.view.state.doc.resolve(prev + props.menu.node.nodeSize - 1)))
        const cleanup = props.view.state.tr.deleteRange(
          prev,
          prev + props.menu.node.nodeSize
        );
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
        <FontAwesomeIcon icon={regular("plus")} className="icon clickable" />
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
        <FontAwesomeIcon
          icon={solid("grip-dots-vertical")}
          className="icon clickable"
        />
      </li>
    </menu>
  );
}

export default SideMenu;
