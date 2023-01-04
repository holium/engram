import { Plugin, PluginKey } from "prosemirror-state";
import { HighlightMenu } from "@/components/menus/types";

export const HighlightMenuPluginKey = new PluginKey("highlightmenu");

let on = false;

export const highlightmenu = (pushMenu: (menu: HighlightMenu | null) => void) => {
    return new Plugin({
        key: HighlightMenuPluginKey,
        props: {
            markViews: {
                'hyperlink': (mark) => {
                    const dom = document.createElement("a");
                    dom.href = mark.attrs.href;
                    dom.target = "_blank"
                    dom.addEventListener("click", (event: MouseEvent) => {
                        event.preventDefault();
                        window.open(mark.attrs.href, "_blank");
                    });
                    return {
                        dom
                    }
                }
            }
        },
        view() {
            return {
            update: (view, prev) => {
                const state = view.state;
                if (
                    prev &&
                    prev.doc.eq(state.doc) &&
                    prev.selection.eq(state.selection)
                ) {
                    if(on) pushMenu(null); on = false;
                    return;
                }
    
                if (state.selection.empty) {
                    if(on) pushMenu(null); on = false;
                    return;
                }
    
                if ((state.selection as any).node) {
                    if(on) pushMenu(null); on = false;
                    return;
                }
    
                const { from, to } = state.selection;
                const start = view.coordsAtPos(from);
                const end = view.coordsAtPos(to);
                const left =
                Math.min(start.left, end.left);
                pushMenu(new HighlightMenu({ top: start.top, left: left}, from, to));
                on = true;
            },
            };
        },
    });
  };

  export default highlightmenu;