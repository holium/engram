import { Plugin, PluginKey } from "prosemirror-state";

export const BaublePluginKey = new PluginKey("bauble");

export const bauble = (update: (bauble: BaubleUpdate) => void) =>
  new Plugin({
    key: BaublePluginKey,
    props: {
      handleDOMEvents: {
        mouseover: (view, event) => {
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (pos && pos.inside >= 0) {
            const dom = view.nodeDOM(pos.inside);
            const node = view.state.doc.nodeAt(pos.inside);
            if (dom && node && node.type.name != "header" && node.type.name != "title" && node.type.name != "description") {
              const box = (dom as Element).getBoundingClientRect();
              const parent = document.querySelector(".ProseMirror");
              let top = box.top;
              if(parent) top = top - parent.getBoundingClientRect().top;
              update({
                on: true,
                top: top,
                node: node,
                el: dom,
                pos: pos.inside,
              });
            } else {
              update({
                on: false,
                node: null,
                el: null,
              });
            }
          } else {
            update({
              on: false,
              node: null,
              el: null,
            });
          }
        },
      },
    },
  });

export default bauble;

export interface Bauble {
  on: boolean;
  top: number;
  node: any;
  el: any;
  pos: number;
}

export interface BaubleUpdate {
  on?: boolean;
  top?: number;
  node?: any;
  el?: any;
  pos?: number;
}
