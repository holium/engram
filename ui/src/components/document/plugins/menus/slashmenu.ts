import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

export default (
  //getMenu: () => any,
  renderMenu: (loc: SelectionLocation | null) => void,
  //updateMenu: (letter: string) => void,
  //tabMenu: (index: number) => void,
  //selectMenu: (run: boolean | null) => void
  reportEvent: (event: KeyboardEvent) => void
) => {
  let search = "";
  let tab = 0;
  return new Plugin({
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        const sel = view.state.selection;
        console.log(event);
        if (event.key === "/") {
          const start = view.coordsAtPos(sel.from);
          const end = view.coordsAtPos(sel.to);
          const parent = document.querySelector("main").getBoundingClientRect();
          const left =
            Math.max((start.left + end.left) / 2, start.left + 3) - parent.left;
          reportEvent(event);
          renderMenu({
            node: null,
            to: sel.to,
            from: sel.from,
            left: left,
            top: start.bottom - parent.top,
          });
        } else {
          reportEvent(event);
        }
      },
      /*
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        const sel = view.state.selection;
        console.log(event);
        if (event.key === "/") {
          search = "";
          tab = 0;
          selectMenu(false);
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
          search = search + event.key;
          updateMenu(search);
        } else if (event.key == "ArrowDown" && getMenu() != null) {
          event.preventDefault();
          tab = tab + 1;
          tabMenu(tab);
        } else if (event.key == "ArrowUp" && getMenu() != null) {
          event.preventDefault();
          tab = tab - 1;
          tabMenu(tab);
        } else if (event.key == "Enter" && getMenu() != null) {
          event.preventDefault();
          selectMenu(true);
        } else {
          renderMenu(null);
          search = "";
          tab = 0;
          tabMenu(0);
          updateMenu(search);
        }
      },
      */
      handleClick(view: EditorView, event: any) {
        console.log(event);
        renderMenu(null);
        search = "";
        //updateMenu(search);
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
