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
            console.log(dom);
            if (dom) {
              const box = (dom as Element).getBoundingClientRect();
              update({
                on: true,
                top: box.top,
                node: null,
              });
            } else {
              update({
                on: false,
                node: null,
              });
            }
          } else {
            update({
              on: false,
              node: null,
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
}

export interface BaubleUpdate {
  on?: boolean;
  top?: number;
  node?: any;
}
