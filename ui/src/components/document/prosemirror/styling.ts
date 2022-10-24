import { Plugin, PluginKey } from "prosemirror-state";
import type { Property } from "./property"

export const StylingPluginKey = new PluginKey("styling");

export const styling = (onChange: (styling: StylingUpdate) => void) => new Plugin({
  key: StylingPluginKey,
  props: {
    nodeViews: {
      "styling": (node, view, getPos) => {
        const dom = document.createElement("fieldset");
        dom.setAttribute("name", "styling");
        console.log("styling:", node);
        const update: { [key: string]: any} = {
          "root-size": { key: "root-size", value: null, pos: getPos() },
          "ratio": { key: "ratio", value: null, pos: getPos() },
          "document-width": { key: "document-width", value: null, pos: getPos() },
          "document-margin": { key: "document-margin", value: null, pos: getPos() },

          "body-font-family": { key: "body-font-family", value: null, pos: getPos() },
          "heading-font-family": { key: "heading-font-family", value: null, pos: getPos() },
          "heading-weight": { key: "heading-weight", value: null, pos: getPos() },
        }
        node.content.forEach((node, offset, index) => {
          console.log("style element");
          if(node.type.name == "property") {
            update[node.attrs.key as string] = node.attrs.value;
            (document.querySelector(":root") as any).style.setProperty(`---${node.attrs.key}`, node.attrs.value);
          }
        })
        onChange(update);
        return {
          dom: dom,
          /*
          update: (node): boolean => {
            console.log("updated styling: ", node);
            const update: { [key: string]: any} = {
              "root-size": { key: "root-size", value: null, pos: getPos() },
              "ratio": { key: "ratio", value: null, pos: getPos() },
              "document-width": { key: "document-width", value: null, pos: getPos() },
              "document-margin": { key: "document-margin", value: null, pos: getPos() },

              "body-font-family": { key: "body-font-family", value: null, pos: getPos() },
              "heading-font-family": { key: "heading-font-family", value: null, pos: getPos() },
              "heading-weight": { key: "heading-weight", value: null, pos: getPos() },
            }
            node.content.forEach((node, offset, index) => {
              console.log("style element");
              if(node.type.name == "property") {
                update[node.attrs.key as string] = { pos: getPos() + offset, key: node.attrs.key, value: node.attrs.value };
                (document.querySelector(":root") as any).style.setProperty(`---${node.attrs.key}`, node.attrs.value);
              }
            })
            onChange(update);
            return true;
          }
          */
        }
      }
    }
  }
})

export default styling;

export interface Styling {
  "root-size": Property,
  "ratio": Property,
  "document-width": Property,
  "document-margin": Property,

  "body-font-family": Property,
  "heading-font-family": Property,
  "heading-weight": Property,
}

export interface StylingUpdate {
  "root-size"?: Property,
  "ratio"?: Property,
  "document-width"?: Property,
  "document-margin"?: Property,

  "body-font-family"?: Property,
  "heading-font-family"?: Property,
  "heading-weight"?: Property,
}
