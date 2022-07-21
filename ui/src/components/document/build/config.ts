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
        display: "Heading Weight",
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
      return new ThemeConfig(config)
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
        contentDOM.classList.add("Prosemirror-config-terms")
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
