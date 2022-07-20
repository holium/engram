import { Plugin, PluginKey } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import schema from "./schema.ts"

interface ConfigTerm {
  key: string;
  display: string;
  type: string;
  value: any;
  styles: { [key: string]: (value: any) => string;}
}

export class ThemeConfig {

  target = ".Prosemirror";

  config = ThemeConfig.defaultConfig;


  constructor(config: {
    "frequency"?: number,
    "ratio"?: number,

    "paper-color"?: string,
    "type-color"?: string,
    "off-color"?: string,
    "primary-color"?: string,
    "success-color"?: string,
    "warning-color"?: string,
    "failure-color"?: string,

    "docment-width"?: number,
  }) {
    console.log("constructing config with:", config)
    Object.keys(config).forEach((style) => {
      if(this.config[style]) this.config[style].value = config[style];
    })
    this.implementAll();
  }

  // set the value of a config field
  setField(key: string, value: any) {
    this.config[key].value = value;
    this.implement(key)
  }

  // implement a config field into a css variable
  implement(key: string) {
    Object.keys(this.config[key].styles).forEach((style: string) => {
      document.documentElement.style.setProperty(
        style,
        this.config[key].styles[style](this.config[key].value)
      )
    })
  }

  implementAll() {
    Object.keys(this.config).forEach((key) => {
      this.implement(key)
    })
  }

  static defaultConfig: { [key: string]: ConfigTerm } = {
    // Typescale ---------------------------------------------------------------
    // The root font size
    "frequency": {
       key: 'frequency',
       display: "Typescale Root",
       type: "number", value: 16, // assumes default is 16px, converts to em to comply with browser/machine settings
       styles: { "--root-frequency": (value: number) => { return `${value / 16}em` }}
     },
     // The ratio between octaves in the typescale
     "ratio": {
        key: 'ratio',
        display: "Typescale Ratio",
        type: "number",
        value: 2,
        styles: {
          "--title": (value: number) => { return `${value ** (4/3)}rem`},
          "--h1": (value: number) => { return `${value}rem`},
          "--h2": (value: number) => { return `${value ** (2/3)}rem`},
          "--h3": (value: number) => { return `${value ** (1/3)}rem`},
          "--footer": (value: number) => { return `${value ** (-1/3)}rem`},
          "--small": (value: number) => { return `${value ** -1}rem`},

          "--margin-before": (value: number) => { return `1em`},
          "--margin-after": (value: number) => { return `${value ** -1}em`},
          "--leading-body": (value: number) => { return `${value ** (1/3)}em`},
          "--leading-heading": (value: number) => { return `${value ** (2/3)}em`},
        }
      },
      "heading-weight": {
        key: "heading-weight",
        display: "Height Weight",
        type: "number",
        value: 700,
        styles: {
          "--heading-weight": (value: number) => { return `${value}`}
        }
      },

      // Colours ---------------------------------------------------------------
      "paper-color": {
        key: 'paper-color',
        display: "Paper Color",
        type: "color",
        value: "#FBFBFB" ,
        styles: {
          "--paper-color": (value: string) => { return value; },
          "--paper-glass-color": (value: string) => {return `${value}20`; }
        }
      },
      "type-color": {
        key: 'type-color',
        display: "Type Color",
        type: "color",
         value: "#262626",
         styles: {
           "--type-color": (value: string) => { return value; },
           "--type-glass-color": (value: string) => {return `${value}20`; }
         }
       },
       "off-color": {
         key: 'off-color',
         display: "Off Color",
         type: "color",
         value: "#E2DCC9",
         styles: {
           "--off-color": (value: string) => { return value; },
           "--off-glass-color": (value: string) => {return `${value}20`; }
         }
       },
       "primary-color": {
         key: 'primary-color',
         display: "Primary Color",
         type: "color",
         value: "#38BDF8",
         styles: {
           "--primary-color": (value: string) => { return value; },
           "--primary-glass-color": (value: string) => {return `${value}20`; }
         }
       },
       "success-color": {
         key: 'success-color',
         display: "Success Color",
         type: "color",
         value: "#10A30D",
         styles: {
           "--success-color": (value: string) => { return value; },
           "--success-glass-color": (value: string) => {return `${value}20`; }
         }
       },
       "warning-color": {
         key: 'warning-color',
         display: "Warning  Color",
         type: "color",
         value: "#FACA1F",
         styles: {
           "--warning-color": (value: string) => { return value; },
           "--warning-glass-color": (value: string) => {return `${value}20`; }
         }
       },
       "failure-color": {
         key: 'failure-color',
         display: "Failure Color",
         type: "color",
         value: "#E71F1F",
         styles: {
           "--failure-color": (value: string) => { return value; },
           "--failure-glass-color": (value: string) => {return `${value}20`; }
         }
       },

       // Spacing & Sizing -----------------------------------------------------
       "document-width": {
         key: 'document-width',
         display: "Document Width",
         type: "number",
         value: 60,
         styles: {
           "--document-width": (value: string) => { return `${value}ch`; },
         }
       }
  }
}

export const ConfigSpec = {
  content: "configfield*",
  group: "config",
  parseDOM: [{tag: "dl"}],
  toDOM() {
    return ["dl", 0];
  },
  selectable: false,
  atom: true,
}

export const ConfigTermSpec = {
  group: "configfield",
  attrs: { "term-key": { default: "" }, "term-value": { default: "" }},
  parseDOM: [{tag: "li"}],
  toDOM(node) {
    return ["li", node.attrs];
  },
  selectable: true,
  atom: false,
}

export const ConfigPluginKey = new PluginKey("config");

export const config = (target?: string) => new Plugin({
  key: ConfigPluginKey,
  state: {
    init: (_, state) => {
      let config = {};
      state.doc.descendants((node, pos, parent, index) => {
        if(node.type.name === "header") return true;
        if(node.type.name === "config") return true;
        if(node.type.name === "config-field") {
          config[node.attrs["term-key"]] = node.attrs["term-value"]
        }
        return false;
      })
      return new ThemeConfig(config, target)
    },
    apply: (tr, value, state) => {
      console.log(tr)
      console.log(state)
      return value;
    }
  },
  props: {
    nodeViews: {
      "config": (node,view, getPos) => {
        const dom = document.createElement("div");
        const panel = document.createElement("div");

        const toggle = document.createElement("input")
        toggle.setAttribute("type", "checkbox")
        toggle.id = "Prosemirror-config-toggle"
        panel.appendChild(toggle);

        const label = document.createElement("label")
        label.setAttribute("for", "Prosemirror-config-toggle")
        label.innerHTML = "toggle config"
        panel.appendChild(label)

        const add = document.createElement("button")
        add.innerHTML = "add config"
        add.addEventListener("click", () => {
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
          const term = Object.keys(configState).filter((key) => !exclude.includes(key))[0]
          if(term) {
            addConfigTerm(term, view, configState);
          }
        })
        panel.appendChild(add)
        dom.appendChild(panel)

        const contentDOM = document.createElement("dl")
        dom.appendChild(contentDOM)

        return {dom: dom, contentDOM: contentDOM};
      },
      "configfield": (node, view, getPos) => {
        const config = view.state["config$"].config;
        const term = config[node.attrs["term-key"]];

        const dom = document.createElement("li")
        const termItem = document.createElement("dt")
        termItem.innerHTML = term.display;
        dom.appendChild(termItem);

        const definition = document.createElement("dd")
        const input = document.createElement("input")
        input.setAttribute("type", term.type);
        input.setAttribute("value", term.value);
        input.addEventListener("change", (event) => {
          console.log(event)
          console.log((event.target as any).value)
          input.setAttribute("value", (event.target as any).value);
          const tr = view.state.tr.setNodeMarkup(getPos(), null, { "term-key": term.key, "term-value": (event.target as any).value })
          view.dispatch(tr)
        })
        definition.appendChild(input);
        dom.appendChild(definition);

        return {
          dom: dom,
          update: (newNode) => {
            console.log(newNode)
            const configState = view.state["config$"];
            console.log(configState)
            if(newNode.attrs["term-value"] != configState.config[newNode.attrs["term-key"]].value) {
              configState.setField(newNode.attrs["term-key"], newNode.attrs["term-value"]);
            }
            return true;
          },
          stopEvent: (event) => {
            if(event.target && (event.target as any).isEqualNode) return (event.target as any).isEqualNode(input);
            return false;
          }
        }
      }
    }
  }

})

function assembleConfigTerm(term: ConfigTerm, view: EditorView, getPos: () => number) {


  return item;
}

function addConfigTerm(term, view, state) {
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
      if(Object.keys(ThemeConfig.defaultConfig).indexOf(node.attrs["term-key"]) > Object.keys(ThemeConfig.defaultConfig).indexOf(term)) {
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
