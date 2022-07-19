import suggestions from "./suggestions.ts"
import { SuggestionItem } from "./suggestions.ts"
import { useState, useEffect } from "react"

function SlashMenu(props) {

  const [results, setResults] = useState(Object.keys(suggestions))

  useEffect(() => {
    setResults(Object.keys(suggestions).filter((suggestion) => suggestion.match(props.search)));
  }, [props.search])

  function runCommand(suggestion: string) {
    suggestions[suggestion].command(props.view);
    props.hide();
  }

  return (
    <div
      className="slashmenu"
      style={{
        left: `${props.menu.left}px`,
        top: `calc(${props.menu.top}px - 2em)`,
      }}
    >
      {results.map((suggestion) => {
        return (
          <div key={suggestion} onClick={() => {runCommand(suggestion)}}>
            { suggestions[suggestion].display }
          </div>
        )
      })}
    </div>
  )
}

export default SlashMenu
