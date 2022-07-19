import { Plugin } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

export default (renderMenu: (loc: BlockLocation | null) => void) => {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mouseover: (view, event) => {
          if (event.target) {
            const box = (event.target as any).getBoundingClientRect();
            const pos = view.posAtCoords(box);
            const loc = getBlockLoc(view, view.state.doc, pos.pos);
            renderMenu(loc);
          } else {
            renderMenu(null);
          }
        },
        mouseleave: (view, event) => {
          if (
            event.relatedTarget &&
            (event.relatedTarget as any).className != "sidemenu"
          ) {
            renderMenu(null);
          }
        },
      },
    },
  });
};

/* Helpers */

interface BlockLocation {
  node: Node;
  pos: number;
  top: number;
}

const active = null as null | BlockLocation;

const getBlockLoc = (
  view: EditorView,
  node: Node,
  pos: number
): null | BlockLocation => {
  let i = 1;
  for (let j = 0; j < (node.content as any).content.length; j += 1) {
    const block = (node.content as any).content[j];
    if (i <= pos && pos < i + block.nodeSize) {
      if (["header"].includes(block.type.name)) return null;
      const box = (view.domAtPos(i).node as any).getBoundingClientRect();
      return {
        node: block,
        pos: i,
        top: box ? box.top : 0,
      };
    } else {
      i = i + block.nodeSize;
    }
  }
  return null;
};
