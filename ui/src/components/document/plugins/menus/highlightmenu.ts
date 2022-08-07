import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

export default (renderMenu: (loc: SelectionLocation | null) => void) => {
  return new Plugin({
    view() {
      return {
        update: (view, prev) => {
          const state = view.state;
          if (
            prev &&
            prev.doc.eq(state.doc) &&
            prev.selection.eq(state.selection)
          ) {
            renderMenu(null);
            return;
          }

          if (state.selection.empty) {
            renderMenu(null);
            return;
          }

          if ((state.selection as any).node) {
            renderMenu(null);
            return;
          }

          const { from, to } = state.selection;
          const start = view.coordsAtPos(from);
          const end = view.coordsAtPos(to);
          const parent = document
            .querySelector("main")
            .getBoundingClientRect();
          const left =
            Math.min(start.left, end.left) - parent.left;
          renderMenu({
            node: view.state.doc.nodeAt(from),
            to: to,
            from: from,
            left: left,
            top: start.top - parent.top,
          });
        },
      };
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
