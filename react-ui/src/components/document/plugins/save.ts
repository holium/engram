import { Plugin, PluginKey } from "prosemirror-state";

export const SavePluginKey = new PluginKey("save");

export const save = (save: () => void) =>
  new Plugin({
    state: {
      init: () => {
        return save;
      },
      apply: () => {},
    },
    props: {
      handleDOMEvents: {
        blur: save,
      },
      handleKeyDown: (view, event) => {
        if (event.ctrlKey && event.key == "s") {
          event.preventDefault();
          save();
        }
      },
    },
  });
