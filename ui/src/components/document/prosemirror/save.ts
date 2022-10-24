import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

export const SavePluginKey = new PluginKey("save");

export const save = (save: (view: EditorView) => void) =>
  new Plugin({
    props: {
      handleDOMEvents: {
        blur: (view) => {
          save(view);
        },
      },
      handleKeyDown: (view, event) => {
        if (event.ctrlKey && event.key == "s") {
          event.preventDefault();
          save(view);
        }
      },
    },
  });

export default save;
