import SlashMenuVue from "@/components/menus/SlashMenu.vue";
import { Plugin, PluginKey } from "prosemirror-state";
import { SlashMenu } from "../../menus/types";

const SlahsMenuPluginKey = new PluginKey("slashmenu");

const slashmenu = (pushMenu: (menu: SlashMenu) => void) => new Plugin({
    key: SlahsMenuPluginKey,
    props: {
        handleDOMEvents: {
            keydown: (view, event) => {
                const sel = view.state.selection;
                if(event.key == "/") {
                    const start = view.coordsAtPos(sel.from);
                    const end = view.coordsAtPos(sel.to);
                    const left =
                        Math.max((start.left + end.left) / 2, start.left + 3);
                    pushMenu(new SlashMenu({ top: start.top, left: left }));
                    event.preventDefault();
                }
                return true;
            }
        }
    }
})

export default slashmenu