import suggestions from "./suggestions";
import { SuggestionItem } from "./suggestions";
import { useState, useEffect, useRef } from "react";
import { undo } from "../../prosemirror/crdt/undo";

function NodeMenu(props) {
  console.log(props.menu.node == null);
  const [search, setSearch] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const menuRef = useRef(null);

  useEffect(() => {
    if (props.hideOnBlur) menuRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.slashEvent) {
      const sel = props.view.state.selection;
      console.log(props.slashEvent);
      /*
        if (props.event.key === "/") {
          setSearch("");
          setTabIndex(0);
          const start = props.view.coordsAtPos(sel.from);
          const end = props.view.coordsAtPos(sel.to);
          const parent = document.querySelector("main").getBoundingClientRect();
          const left =
            Math.max((start.left + end.left) / 2, start.left + 3) - parent.left;
          renderMenu({
            node: null,
            to: sel.to,
            from: sel.from,
            left: left,
            top: start.bottom - parent.top,
          });
        } else
        */
      if (props.slashEvent.key.match(/^\w$/)) {
        setSearch(search + props.slashEvent.key);
      } else if (props.slashEvent.key == "ArrowDown") {
        props.slashEvent.preventDefault();
        setTabIndex(tabIndex + 1);
      } else if (props.slashEvent.key == "ArrowUp") {
        props.slashEvent.preventDefault();
        setTabIndex(tabIndex == 0 ? 0 : tabIndex - 1);
      } else if (props.slashEvent.key == "Enter") {
        props.slashEvent.preventDefault();
        runCommand(
          Object.values(suggestions).filter(
            (suggestion) =>
              suggestion.key.search(search) >= 0 ||
              suggestion.display.search(search) >= 0
          )[tabIndex].key
        );
      } else if (props.slashEvent.key != "/") {
        console.log("hiding");
        props.hide();
      }
    }
  }, [props.slashEvent]);

  function runCommand(suggestion: string) {
    if (props.menu.node == null) {
      const tr = props.view.state.tr.replaceWith(
        props.menu.from,
        props.menu.from + search.length + 1,
        ""
      );
      props.view.dispatch(tr);
    }
    if (props.pos) suggestions[suggestion].command(props.view, props.pos + 1);
    else suggestions[suggestion].command(props.view);
    props.view.focus();
    props.hide();
  }

  return (
    <menu
      className="slashmenu context-menu select scrollbar-small"
      tabIndex="0"
      ref={menuRef}
      style={{
        overflowY: "auto",
        maxHeight: `${window.innerHeight / 2 - 64}px`,
        left: `${props.menu.left}px`,
        ...(props.menu.top < window.innerHeight / 2
          ? { top: `${props.menu.top}px` }
          : { bottom: `${window.innerHeight - props.menu.top}px` }),
      }}
      onBlur={() => {
        //props.hide();
      }}
    >
      {Object.values(suggestions)
        .filter(
          (suggestion) =>
            suggestion.key.search(search) >= 0 ||
            suggestion.display.search(search) >= 0
        )
        .map((suggestion, i, arr) => {
          return (
            <li
              key={suggestion.key}
              className="flex items-center"
              style={
                i == tabIndex % arr.length
                  ? { backgroundColor: "var(--glass-color)" }
                  : {}
              }
              onClick={() => {
                runCommand(suggestion.key);
              }}
            >
              {suggestion.icon()}
              <div className="flex flex-col ml-3">
                <div className="font-bold">{suggestion.display}</div>
                <div style={{ opacity: ".6" }}>{suggestion.description}</div>
              </div>
            </li>
          );
        })}
    </menu>
  );
}

export default NodeMenu;
