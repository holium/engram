import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

let search = ""

export default (renderMenu: (loc: SelectionLocation | null) => void, updateMenu: (letter: string) => void) => {
  return new Plugin({
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        const sel = view.state.selection;
        if(event.key === "/") {
          const start = view.coordsAtPos(sel.from);
          const end = view.coordsAtPos(sel.to);
          const parentLeft = document
            .querySelector("#document")
            .getBoundingClientRect().left;
          const left =
            Math.max((start.left + end.left) / 2, start.left + 3) - parentLeft;
          renderMenu({node: null, to: sel.to, from: sel.from, left: left, top: start.top})
        } else if(event.key.match(/^\w$/)) {
          updateMenu(search)
        } else {
          renderMenu(null);
          updateMenu(null);
        }
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
