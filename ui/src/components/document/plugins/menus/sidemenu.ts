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
            if(pos.inside > 0) {
              let rendered = false;
              let lastPos = 0;
              let lastNode = null;
              view.state.doc.descendants((node, nodePos) => {
                if(!rendered && pos.pos < nodePos) {
                  rendered = true;
                  const top = (view.domAtPos(lastPos + 1).node as any).getBoundingClientRect().top;
                  if(lastNode.type.name !== "header") {
                    const parent = document.querySelector("main").getBoundingClientRect().top;
                    const loc = {
                      node: lastNode,
                      pos: lastPos,
                      top: top - parent,
                    }
                    renderMenu(loc);
                  }
                }
                lastPos = nodePos;
                lastNode = node;
                return false;
              })
              if(!rendered) {
                const top = (view.domAtPos(lastPos + 1).node as any).getBoundingClientRect().top;
                const parent = document.querySelector("main").getBoundingClientRect().top;
                const loc = {
                  node: lastNode,
                  pos: lastPos,
                  top: top - parent,
                }
                renderMenu(loc);
              }
            }
          } else {
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
