import { Plugin, PluginKey } from "prosemirror-state";
import { DocumentConfig, ConfigTerm } from "./config";
import { assembleConfigNodeView, assembleConfigTermNodeView } from "./helpers";

export const ConfigSpec = {
  content: "configfield*",
  group: "config",
  parseDOM: [{ tag: "dl" }],
  toDOM() {
    return ["dl", 0];
  },
  selectable: false,
  atom: true,
};

export const ConfigTermSpec = {
  group: "configfield",
  attrs: { "term-key": { default: "" }, "term-value": { default: "" } },
  parseDOM: [{ tag: "li" }],
  toDOM(node) {
    return ["li", node.attrs];
  },
  selectable: true,
  atom: false,
};

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
          if (node.type.name === "config-field") {
            config[node.attrs["term-key"]] = node.attrs["term-value"];
          }
          return false;
        });
        return new DocumentConfig(config);
      },
      apply: (tr, value, state) => {
        return value;
      },
    },
    props: {
      nodeViews: {
        config: (node, view, getPos) => {
          const { dom, contentDOM } = assembleConfigNodeView(view, renderMenu);

          return { dom: dom, contentDOM: contentDOM };
        },
        configfield: (node, view, getPos) => {
          console.log(view.state["config$"]);
          const config = view.state["config$"].config;
          const term = config[node.attrs["term-key"]];

          const { dom, input } = assembleConfigTermNodeView(view, term, getPos);

          return {
            dom: dom,
            update: (newNode) => {
              const configState = view.state["config$"];
              if (
                newNode.attrs["term-value"] !=
                configState.config[newNode.attrs["term-key"]].value
              ) {
                configState.setField(
                  newNode.attrs["term-key"],
                  newNode.attrs["term-value"]
                );
              }
              return true;
            },
            stopEvent: (event) => {
              if (event.target && (event.target as any).isEqualNode)
                return (event.target as any).isEqualNode(input);
              return false;
            },
          };
        },
      },
    },
  });
