import suggestions from "./suggestions";
import { SuggestionItem } from "./suggestions";
import { useState, useEffect } from "react";

function NodeMenu(props) {
  const [results, setResults] = useState(Object.keys(suggestions));

  useEffect(() => {
    setResults(
      Object.keys(suggestions).filter((suggestion) =>
        suggestion.match(props.search)
      )
    );
  }, [props.search]);

  function runCommand(suggestion: string) {
    if (props.pos) suggestions[suggestion].command(props.view, props.pos + 1);
    else suggestions[suggestion].command(props.view);
    props.view.focus();
    props.hide();
  }

  return (
    <menu
      className="slashmenu context-menu select"
      style={{
        left: `${props.menu.left}px`,
        top: `${props.menu.top}px`,
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
