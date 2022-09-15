import { EditorView } from "prosemirror-view";
import { DocumentConfig, ConfigTerm } from "./config";
import schema from "../../build/schema";

export function assembleConfigNodeView() {
  const dom = document.createElement("dl");
  dom.style.display = "none";
  return dom;
}

export function assembleConfigTermNodeView(term: ConfigTerm) {
  const dom = document.createElement("li");
  const termItem = document.createElement("dt");
  termItem.innerHTML = term.display;
  dom.appendChild(termItem);

  const definition = document.createElement("dd");
  definition.innerHTML = term.value;
  dom.appendChild(definition);

  return dom;
}
