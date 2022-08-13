import { Plugin, PluginKey } from "prosemirror-state";

export const SavePluginKey = new PluginKey("save");

export default (save: () => void) =>
  new Plugin({
    props: {
      handleDOMEvents: {
        "blur": save
      },
      handleKeyDown: (view, event) => {
        if (event.ctrlKey && event.key == "s") {
	  event.preventDefault();
	  save();
	}
      },
    },
  });