import { Plugin, PluginKey } from "prosemirror-state";
import { NodeSpec } from "prosemirror-model";
import { DocumentConfig, ConfigTerm } from "./config";
import { assembleConfigNodeView, assembleConfigTermNodeView } from "./helpers";

export const ConfigSpec = {
  content: "typefrequency typeratio headingtypeface bodytypeface documentwidth",
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
  const config = view.state["config$"].config;
  const term = config[node.type.name];

  const dom = assembleConfigTermNodeView(term);

  return {
    dom: dom,
    update: (newNode) => {
      const configState = view.state["config$"];
      if (newNode.attrs["value"] != configState.config[node.type.name].value) {
        configState.setTerm(node.type.name, newNode.attrs["value"]);
      }
      return true;
    },
  };
}

export const ConfigPluginKey = new PluginKey("config");

export const config = new Plugin({
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
    apply: (tr, value, state, oldState) => {
      const meta = tr.getMeta(ConfigPluginKey);
      if (meta) {
        const newState = ConfigPluginKey.getState(state).setTerm(
          meta.term,
          meta.value
        );
        return newState;
      }
      return value;
    },
  },
  props: {
    nodeViews: {
      config: (node, view, getPos) => {
        const dom = assembleConfigNodeView();
        return { dom: dom, contentDOM: dom };
      },
      typefrequency: configTermView,
      typeratio: configTermView,
      headingtypeface: configTermView,
      bodytypeface: configTermView,
      documentwidth: configTermView,
    },
  },
});
