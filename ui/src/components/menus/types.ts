import { suggestions } from "../document/prosemirror/suggestions";

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

    constructor(location:  { top: number, left: number }) {
        super(location, suggestions, false);
    }
}

export interface MenuItem {
    display: string;
    icon: string;
    command: () => void;
}