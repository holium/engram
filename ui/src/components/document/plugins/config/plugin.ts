import { Plugin, PluginKey } from "prosemirror-state";
import { NodeSpec } from "prosemirror-model";
import { DocumentConfig, ConfigTerm } from "./config";
import { assembleConfigNodeView, assembleConfigTermNodeView } from "./helpers";

export const ConfigSpec = {
  content:
    "type-frequency type-ratio heading-typeface body-typeface document-width",
  group: "config",
  parseDOM: [{ tag: "dl" }],
  toDOM() {
    return ["dl", 0];
  },
  selectable: false,
  atom: true,
};

export const ConfigTermSpec = (defaultValue: any): NodeSpec => {
  return {
    group: "configterm",
    attrs: { value: { default: defaultValue } },
    parseDOM: [{ tag: "li" }],
    toDOM(node) {
      return ["li", node.attrs];
    },
    selectable: false,
    atom: false,
  };
};

function configTermView(node, view, getPos) {
  console.log(view.state["config$"]);
  const config = view.state["config$"].config;
  const term = config[node.name];

  const dom = assembleConfigTermNodeView(term);

  return {
    dom: dom,
    update: (newNode) => {
      const configState = view.state["config$"];
      if (newNode.attrs["value"] != configState.config[node.name].value) {
        configState.setField(node.name, newNode.attrs["value"]);
      }
      return true;
    },
  };
}

export const ConfigPluginKey = new PluginKey("config");

export const config = (renderMenu: (options: Array<ConfigTerm>) => void) =>
  new Plugin({
    key: ConfigPluginKey,
    state: {
      init: (_, state) => {
        let config = {};
        state.doc.descendants((node, pos, parent, index) => {
          if (node.type.name === "header") return true;
          if (node.type.name === "config") return true;
          if (node.type.spec.group === "configterm") {
            config[node.type.name] = node.attrs["value"];
          }
          return false;
        });
        return new DocumentConfig(config);
      },
      apply: (tr, value, state) => {
        const meta = tr.getMeta(ConfigPluginKey);
        if (meta) {
          ConfigPluginKey.getState(state).setTerm(meta.term, meta.value);
        }
        return value;
      },
    },
    props: {
      nodeViews: {
        config: (node, view, getPos) => {
          return { dom: assembleConfigNodeView() };
        },
        "type-frequency": configTermView,
        "type-ratio": configTermView,
        "heading-typeface": configTermView,
        "body-typeface": configTermView,
        "document-width": configTermView,
      },
    },
  });
