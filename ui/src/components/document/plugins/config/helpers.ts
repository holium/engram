import { EditorView } from "prosemirror-view"
import { DocumentConfig, ConfigTerm } from "./config.ts"
import schema from "../../build/schema.ts"

export function assembleConfigNodeView(view: EditorView, renderMenu: (options: any) => void) {
  const dom = document.createElement("div");
  dom.classList.add("Prosemirror-config")
  const panel = document.createElement("div");
  panel.classList.add("Prosemirror-config-panel")

  const toggle = document.createElement("input")
  toggle.setAttribute("type", "checkbox")
  toggle.id = "Prosemirror-config-toggle"
  dom.appendChild(toggle);

  const label = document.createElement("label")
  label.setAttribute("for", "Prosemirror-config-toggle")
  label.id = "Prosemirror-config-toggler"
  label.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      style="fill: 'var(--type-color)'"
    >
      <path d="M507.5 117.1c-2.1-12.13-12.37-21.75-24.5-25.13c-12.12-3.25-25.12 .125-33.1 9L390.4 159.6L357.9 154.2l-5.375-32.38l58.75-58.75c8.75-8.875 12.25-21.88 8.875-33.88c-3.375-12.13-13.12-21.5-25.25-24.63c-53.12-13.13-107.1 2.125-146.6 40.75c-37.62 37.63-52.62 91.38-40.75 143.3L23.1 371.1C8.5 387.5 0 408.1 0 429.1s8.5 42.5 23.1 58S60.12 512 81.1 512c21.88 0 42.5-8.5 58-24l183.4-183.3c51.75 11.88 105.6-3.125 143.5-41C504.9 225.7 520.5 169.5 507.5 117.1zM432.9 229.9c-28.5 28.5-70.25 38.13-108.1 25.25l-14.12-4.75l-203.7 203.6c-12.75 12.88-35.25 12.88-47.1 0c-6.499-6.375-9.999-14.88-9.999-24c0-9 3.5-17.63 9.999-24l203.9-203.8l-4.625-14.13C244.4 149.2 253.1 107.5 282.2 79.24c20.37-20.25 47.12-31.25 74.1-31.25h1.125L301.1 105.4l15.12 90.5l90.5 15.13l57.37-57.25C464.5 181.1 453.5 209.2 432.9 229.9zM87.1 407.1c-8.875 0-15.1 7.125-15.1 16c0 8.875 7.125 16 15.1 16s15.1-7.125 15.1-16C103.1 415.1 96.87 407.1 87.1 407.1z"/>
    </svg>
  `
  panel.appendChild(label)

  const add = document.createElement("label")
  add.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width="1em"
      height="1em"
      style="fill: 'var(--type-color)'"
    >
      <path d="M432 256C432 269.3 421.3 280 408 280h-160v160c0 13.25-10.75 24.01-24 24.01S200 453.3 200 440v-160h-160c-13.25 0-24-10.74-24-23.99C16 242.8 26.75 232 40 232h160v-160c0-13.25 10.75-23.99 24-23.99S248 58.75 248 72v160h160C421.3 232 432 242.8 432 256z"/>
    </svg> add config`
  add.addEventListener("click", (event) => {
    const exclude = []
    view.state.doc.descendants((term, pos, parent, index) => {
      if(term.type.name === "header") return true;
      if(term.type.name === "config") return true;
      if(term.type.name === "configfield") {
        exclude.push(term.attrs["term-key"])
      }
      return false;
    })
    const configState = view.state["config$"].config;

    const terms = Object.values(configState).filter((key) => !exclude.includes(key))
    const parent = document.querySelector("main").getBoundingClientRect();
    renderMenu({
      options: terms,
      left: event.clientX - parent.left,
      top: event.clientY - parent.top,
      state: configState,
    })
  })
  panel.appendChild(add)
  dom.appendChild(panel)

  const contentDOM = document.createElement("dl")
  contentDOM.classList.add("Prosemirror-config-terms")
  contentDOM.classList.add("context-menu")
  dom.appendChild(contentDOM)

  return { dom, contentDOM }
}

export function assembleConfigTermNodeView(view: EditorView, term: ConfigTerm, getPos: () => number) {
  const dom = document.createElement("li")
  const termItem = document.createElement("dt")
  termItem.innerHTML = term.display;
  dom.appendChild(termItem);

  const definition = document.createElement("dd")
  let input;
  if(term.type === "select") {
    input = document.createElement("select")
    Object.keys(term.options).forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.setAttribute("value", term.options[option])
      optionEl.innerHTML = option;
      input.appendChild(optionEl)
    })
  } else {
    input = document.createElement("input")
    input.setAttribute("type", term.type);
  }

  input.setAttribute("value", term.value);
  input.addEventListener("change", (event) => {
    input.setAttribute("value", (event.target as any).value);
    const tr = view.state.tr.setNodeMarkup(getPos(), null, { "term-key": term.key, "term-value": (event.target as any).value })
    view.dispatch(tr)
  })
  definition.appendChild(input);
  dom.appendChild(definition);
  return { dom, input };
}


export function addConfigTerm(term, view, state) {
  let inserted = false;
  let lastPos = 0;
  view.state.doc.descendants((node, pos) => {
    if(node.type.name === "header") return true;
    if(node.type.name === "config") {
      lastPos = pos;
      return true;
    }
    if(node.type.name === "configfield" && !inserted) {
      lastPos = pos;
      if(Object.keys(DocumentConfig.defaultConfig).indexOf(node.attrs["term-key"]) > Object.keys(DocumentConfig.defaultConfig).indexOf(term)) {
        inserted = true;
        const tr = view.state.tr.insert(lastPos + 1, schema.nodes["configfield"].create({ "term-key": term, "term-value": state[term].value }))
        view.dispatch(tr)
      }
    }
    return false;
  })
  if(lastPos != 0) {
    const tr = view.state.tr.insert(lastPos + 1, schema.nodes["configfield"].create({ "term-key": term, "term-value": state[term].value }))
    view.dispatch(tr)
  }
}
