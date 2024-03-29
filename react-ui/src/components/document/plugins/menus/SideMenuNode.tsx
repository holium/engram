import { useState, useRef, useEffect } from "react";
import { dropPoint } from "prosemirror-transform";
import NodeMenu from "./NodeMenuNode";

import { createNodeNear } from "../../prosemirror/commands";

function SideMenu(props) {
  const [nodeMenu, setNodeMenu] = useState(null);
  const [pos, setPos] = useState(props.menu.pos);

  useEffect(() => {
    setPos(props.menu.pos);
    setNodeMenu(null);
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

  function handleDragStart(event: DragEvent) {
    //(props.menu.el as HTMLElement).style.opacity = "0.5";
    event.dataTransfer.setDragImage(props.menu.el, 0, 0);
  }

  function handleDrag(event: DragEvent) {
    //
  }

  function handleDragEnd(event) {
    const cursor = props.view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (cursor && cursor.pos != pos) {
      const target = dropPoint(
        props.view.state.doc,
        cursor.pos,
        props.menu.node
      );
      console.log(target, cursor.pos);

      let inserted = false;
      let finalPos;
      let finalTr = null;
      props.view.state.doc.descendants((childNode, childPos, parentNode) => {
        if (!inserted && childPos >= target) {
          const tr = props.view.state.tr.insert(childPos, props.menu.node);
          if (tr.docChanged) {
            inserted = true;
            props.view.dispatch(tr);
            finalPos = childPos;
            finalTr = tr;
          }
        }
        return false;
      });
      if (!inserted) {
        const tr = props.view.state.tr.insert(
          props.view.state.doc.nodeSize - 2,
          props.menu.node
        );
        props.view.dispatch(tr);
        finalPos = props.view.state.doc.nodeSize - 1;
        finalTr = tr;
      }

      if (finalTr != null) {
        const prev = finalTr.mapping.map(pos);
        //const cleanup = props.view.state.tr.setSelection(new TextSelection(props.view.state.doc.resolve(prev + 1), props.view.state.doc.resolve(prev + props.menu.node.nodeSize - 1)))
        const cleanup = props.view.state.tr.deleteRange(
          prev,
          prev + props.menu.node.nodeSize
        );
        props.view.dispatch(cleanup);
        //toggleMark(schema.marks["strong"])(props.view.state, props.view.dispatch, props.view)
        setPos(finalPos);
      }
    }
  }

  return (
    <menu
      className="sidemenu"
      style={{
        top: `${props.menu.top - 2}px`,
        left: 0,
        position: "absolute",
      }}
      onMouseLeave={props.hide}
    >
      {/* Plus */}
      <div
        onClick={openNodeMenu}
        onMouseLeave={(event) => {
          event.stopPropagation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="var(--type-color)"
          className="icon clickable"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6 6V7h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
        </svg>
      </div>
      {nodeMenu ? (
        <NodeMenu
          menu={nodeMenu}
          view={props.view}
          pos={props.menu.pos}
          hideOnBlur={true}
          hide={() => {
            setNodeMenu(null);
          }}
        />
      ) : (
        ""
      )}
      {/* Drag Handle */}
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseLeave={(event) => {
          event.stopPropagation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="var(--type-color)"
          className="icon clickable"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M11 11V5.828L9.172 7.657 7.757 6.243 12 2l4.243 4.243-1.415 1.414L13 5.828V11h5.172l-1.829-1.828 1.414-1.415L22 12l-4.243 4.243-1.414-1.415L18.172 13H13v5.172l1.828-1.829 1.415 1.414L12 22l-4.243-4.243 1.415-1.414L11 18.172V13H5.828l1.829 1.828-1.414 1.415L2 12l4.243-4.243 1.414 1.415L5.828 11z" />
        </svg>
      </div>
    </menu>
  );
}

export default SideMenu;
