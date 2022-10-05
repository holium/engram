import { Plugin } from "prosemirror-state";
import { DecorationSet, Decoration } from "prosemirror-view";

export default new Plugin({
  props: {
    decorations(state) {
      let doc = state.doc;
      const decos = [];
      /* Title */
      let pos = 1;
      (doc.firstChild.content as any).content.forEach((node) => {
        if (node.content.size == 0) {
          decos.push(
            Decoration.node(pos, pos + node.nodeSize, {
              class: "Prosemirror-placeholder",
            })
          );
        }

        pos = pos + node.nodeSize;
      });
      if (
        (doc.content as any).content.length < 3 &&
        (doc.content as any).content[1].content.size == 0
      ) {
        decos.push(
          Decoration.node(
            doc.firstChild.nodeSize,
            doc.firstChild.nodeSize + (doc.content as any).content[1].nodeSize,
            {
              class: "Prosemirror-placeholder",
            }
          )
        );
      }
      return DecorationSet.create(doc, decos);
    },
  },
});
