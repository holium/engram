import { EditorView } from "prosemirror-view";
import { DocumentConfig, ConfigTerm } from "./config";
import schema from "../../build/schema";

export function assembleConfigNodeView() {
  const dom = document.createElement("dl");
  dom.style.display = "none";
  return dom;
}

/*
export function assembleConfigTermNodeView(
  view: EditorView,
  term: ConfigTerm,
  getPos: () => number
) {
  const dom = document.createElement("li");
  const termItem = document.createElement("dt");
  termItem.innerHTML = term.display;
  dom.appendChild(termItem);

  const definition = document.createElement("dd");
  let input;
  if (term.type === "select") {
    input = document.createElement("select");
    Object.keys(term.options).forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.setAttribute("value", term.options[option]);
      optionEl.innerHTML = option;
      input.appendChild(optionEl);
    });
  } else {
    input = document.createElement("input");
    input.setAttribute("type", term.type);
  }

  input.setAttribute("value", term.value);
  input.addEventListener("change", (event) => {
    input.setAttribute("value", (event.target as any).value);
    const tr = view.state.tr.setNodeMarkup(getPos(), null, {
      "term-key": term.key,
      "term-value": (event.target as any).value,
    });
    view.dispatch(tr);
  });
  definition.appendChild(input);
  dom.appendChild(definition);
  return { dom, input };
}
*/

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

/*
export function addConfigTerm(term, view, state) {
  let inserted = false;
  let lastPos = 0;
  view.state.doc.descendants((node, pos) => {
    if (node.type.name === "header") return true;
    if (node.type.name === "config") {
      lastPos = pos;
      return true;
    }
    if (node.type.name === "configfield" && !inserted) {
      lastPos = pos;
      if (
        Object.keys(DocumentConfig.defaultConfig).indexOf(
          node.attrs["term-key"]
        ) > Object.keys(DocumentConfig.defaultConfig).indexOf(term)
      ) {
        console.log("inserting here");
        inserted = true;
        const tr = view.state.tr.insert(
          lastPos + 1,
          schema.nodes["configfield"].create({
            "term-key": term,
            "term-value": state[term].value,
          })
        );
        view.dispatch(tr);
      }
    }
    return false;
  });
  if (lastPos != 0 && !inserted) {
    console.log("inserting here");
    const tr = view.state.tr.insert(
      lastPos + 1,
      schema.nodes["configfield"].create({
        "term-key": term,
        "term-value": state[term].value,
      })
    );
    view.dispatch(tr);
  }
}
*/
