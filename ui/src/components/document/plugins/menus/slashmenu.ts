import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

let search = "";

export default (
  renderMenu: (loc: SelectionLocation | null) => void,
  updateMenu: (letter: string) => void
) => {
  let search = "";

  return new Plugin({
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        const sel = view.state.selection;
        if (event.key === "/") {
          const start = view.coordsAtPos(sel.from);
          const end = view.coordsAtPos(sel.to);
          const parent = document.querySelector("main").getBoundingClientRect();
          const left =
            Math.max((start.left + end.left) / 2, start.left + 3) - parent.left;
          renderMenu({
            node: null,
            to: sel.to,
            from: sel.from,
            left: left,
            top: start.bottom - parent.top,
          });
        } else if (event.key.match(/^\w$/)) {
          console.log("key: ", event.key);
          search = search + event.key;
          updateMenu(search);
        } else {
          renderMenu(null);
          search = "";
          updateMenu(search);
        }
      },
      handleClick(view: EditorView, event: any) {
        console.log(event);
        renderMenu(null);
        search = "";
        updateMenu(search);
      },
    },
  });
};

interface SelectionLocation {
  node: Node;
  to: number;
  from: number;
  left: number;
  top: number;
}
