import SlashMenuVue from "@/components/menus/SlashMenu.vue";
import { Plugin, PluginKey } from "prosemirror-state";
import { SlashMenu } from "../../menus/types";

const SlahsMenuPluginKey = new PluginKey("slashmenu");

export let search = "";
export let selected = 0;
let left = 0;
let top = 0;

const slashmenu = (pushMenu: (menu: SlashMenu | null) => void) => new Plugin({
    key: SlahsMenuPluginKey,
    props: {
        handleDOMEvents: {
            keydown: (view, event) => {
                const sel = view.state.selection;
                if(event.key == "/") {
                    const start = view.coordsAtPos(sel.from);
                    const end = view.coordsAtPos(sel.to);
                    left =
                        Math.max((start.left + end.left) / 2, start.left + 3);
                    top = start.bottom;
                    pushMenu(new SlashMenu({ top: top, left: left }, search, selected));
                } else if(top != 0 && "abcdefghijklmnop".includes(event.key)) {
                    console.log("pressed letter");
                    search = search + event.key;
                    pushMenu(new SlashMenu({ top: top, left: left }, search, selected));
                } else if(top != 0 && event.key == "ArrowDown") {
                    selected = selected + 1;
                    event.preventDefault();
                    pushMenu(new SlashMenu({ top: top, left: left }, search, selected));
                } else if(top != 0 && event.key == "ArrowUp") {
                    selected = selected == 0 ? selected : selected - 1;
                    event.preventDefault();
                    pushMenu(new SlashMenu({ top: top, left: left }, search, selected));
                } else if(top != 0 && event.key == "Enter") {
                    const tempmenu = (new SlashMenu({ top: top, left: left }, search, selected));
                    const items = tempmenu.items.filter((item) => {
                        return item.display.toLowerCase().search(search.toLowerCase()) > -1;
                    })
                    console.log("Running command: ", items, items[selected % items.length]);
                    tempmenu.clearSearch();
                    items[selected % items.length].command();
                    pushMenu(null);
                    search = "";
                    selected = 0;
                    top = 0;
                    left = 0;
                    event.preventDefault();
                } else {
                    pushMenu(null);
                    search = "";
                    selected = 0;
                    top = 0;
                    left = 0;
                }
                return true;
            }
        }
    }
})

export default slashmenu