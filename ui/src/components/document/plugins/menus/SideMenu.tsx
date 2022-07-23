import { useState, useRef, useEffect } from "react";
import NodeMenu from "./NodeMenu.tsx";
import { TextSelection } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import schema from "../../build/schema.ts";
import { insertAtNextPossible } from "../shortcuts.ts";

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
        top: `${props.menu.top}px`,
        position: "absolute",
      }}
      onMouseLeave={props.hide}
    >
      {/* Plus */}
      <li onClick={openNodeMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="16"
          height="16"
        >
          <path
            fill="#636261"
            d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
          />
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
          viewBox="0 0 256 512"
          fill="#636261"
          width="16"
          height="16"
        >
          <path d="M0 96C0 69.49 21.49 48 48 48C74.51 48 96 69.49 96 96C96 122.5 74.51 144 48 144C21.49 144 0 122.5 0 96zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM96 416C96 442.5 74.51 464 48 464C21.49 464 0 442.5 0 416C0 389.5 21.49 368 48 368C74.51 368 96 389.5 96 416zM160 96C160 69.49 181.5 48 208 48C234.5 48 256 69.49 256 96C256 122.5 234.5 144 208 144C181.5 144 160 122.5 160 96zM256 256C256 282.5 234.5 304 208 304C181.5 304 160 282.5 160 256C160 229.5 181.5 208 208 208C234.5 208 256 229.5 256 256zM160 416C160 389.5 181.5 368 208 368C234.5 368 256 389.5 256 416C256 442.5 234.5 464 208 464C181.5 464 160 442.5 160 416z" />
        </svg>
      </li>
    </menu>
  );
}

export default SideMenu;
