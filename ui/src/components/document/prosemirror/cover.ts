import { Plugin, PluginKey } from "prosemirror-state";
import { setCover } from "./commands"

export const CoverPluginKey = new PluginKey("cover");

export const cover = (onChange: (cover: CoverUpdate) => void) => new Plugin({
  key: CoverPluginKey,
  props: {
    nodeViews: {
      "cover": (node, view, getPos) => {

        const dom = document.createElement("img");
        dom.style.display = "none";

        onChange({
          pos: getPos(),
          src: node.attrs.src,
          xpositioning: node.attrs.xpositioning,
          ypositioning: node.attrs.ypositioning
        })

        return {
          dom: dom,
          update: (node) => {
            onChange({
              pos: getPos(),
              src: node.attrs.src,
              xpositioning: node.attrs.xpositioning,
              ypositioning: node.attrs.ypositioning
            })
            return true;
          }
        }
      }
    }
  }
});

export default cover;

export interface Cover {
  pos: number;
  src: string;
  xpositioning: number;
  ypositioning: number;
}

export interface CoverUpdate {
  pos?: number;
  src?: string;
  xpositioning?: number;
  ypositioning?: number;
}
