import suggestions from "./suggestions.ts";
import { SuggestionItem } from "./suggestions.ts";
import { useState, useEffect } from "react";

function NodeMenu(props) {
  const [results, setResults] = useState(Object.keys(suggestions));

  useEffect(() => {
    console.log("search changed", props.search);
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
            onClick={() => {
              runCommand(suggestion);
            }}
          >
            {suggestions[suggestion].display}
          </li>
        );
      })}
    </menu>
  );
}

export default NodeMenu;
