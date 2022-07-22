import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

export default (renderMenu: (loc: SelectionLocation | null) => void) => {
  return new Plugin({
    view() {
      return {
        update: (view, prev) => {
          const state = view.state;

          if ((state.selection as any).node && (state.selection as any).node.type.name == "image") {
            const { from, to } = state.selection;
            const start = view.coordsAtPos(from);
            const end = view.coordsAtPos(to);
            const parent = document
              .querySelector("#document")
              .getBoundingClientRect()
            const left =
              Math.max((start.left + end.left) / 2, start.left) - parent.left;
            const top = Math.max(start.top, end.top) - parent.top;
            renderMenu({
              node: (state.selection as any).node,
              to: to,
              from: from,
              left: left,
              top: start.top,
            });
            return;
          }
          renderMenu(null);
          return;
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
