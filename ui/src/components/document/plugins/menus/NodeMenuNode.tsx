import suggestions from "./suggestions";
import { SuggestionItem } from "./suggestions";
import { useState, useEffect, useRef } from "react";

function NodeMenu(props) {
  console.log(props.menu.node == null);
  const [results, setResults] = useState(Object.keys(suggestions));

  const menuRef = useRef(null);

  useEffect(() => {
    if (props.hideOnBlur) menuRef.current.focus();
  }, []);

  useEffect(() => {
    setResults(
      Object.keys(suggestions).filter((suggestion) =>
        suggestion.match(props.search)
      )
    );
  }, [props.search]);

  function runCommand(suggestion: string) {
    if (props.menu.node == null) {
      const tr = props.view.state.tr.replaceWith(
        props.menu.from,
        props.menu.from + props.search.length + 1,
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
      {results.map((suggestion) => {
        return (
          <li
            key={suggestion}
            classnName="flex items-center"
            onClick={() => {
              runCommand(suggestion);
            }}
          >
            {suggestions[suggestion].icon()}
            <div className="flex flex-col ml-3">
              <div className="font-bold">{suggestions[suggestion].display}</div>
              <div style={{ opacity: ".6" }}>
                {suggestions[suggestion].description}
              </div>
            </div>
          </li>
        );
      })}
    </menu>
  );
}

export default NodeMenu;
