import { Plugin, PluginKey } from "prosemirror-state";

export const StylingPluginKey = new PluginKey("styling");

export const styling = new Plugin({
  key: StylingPluginKey,
  props: {
    nodeViews: {
      "styling": (node, view, getPos) => {
        const dom = document.createElement("fieldset");
        dom.setAttribute("name", "styling");
        console.log("styling:", node);
        return {
          dom: dom,
          update: (node): boolean => {
            console.log("updated styling: ", node);
            return true;
          }
        }
      }
    }
  }
})

export default styling;
