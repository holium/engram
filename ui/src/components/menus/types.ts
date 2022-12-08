import { suggestions } from "../document/prosemirror/suggestions";
import { view } from "../document/prosemirror/render"

import ContextMenuNode from "./ContextMenu.vue";
import SlashMenuNode from "./SlashMenu.vue";

export class Menu {
    location: { top: string, left: string, width: string };
    items: Array<MenuItem>;
    
    horizontal: boolean;
    dom: any = ContextMenuNode;

    constructor(location: { top: number, left: number }, items: Array<MenuItem>, horizontal=false) {
        this.location = {
            top: `${location.top}px`,
            left: `${location.left}px`,
            width: "240px",
        };
        this.items = items;
        this.horizontal = horizontal;
    }
}

export class SlashMenu extends Menu {

    dom = SlashMenuNode;
    search: string;
    selected: number;

    constructor(location:  { top: number, left: number }, search: string, selected: number) {
        super(location, suggestions, false);
        this.search = search;
        this.selected = selected;
    }

    clearSearch() {
        const sel = view.state.selection;
        const tr = view.state.tr.delete(sel.from - 1 - this.search.length, sel.from);
        view.dispatch(tr);
    }
}

export interface MenuItem {
    display: string;
    icon: string;
    command: () => void;
}