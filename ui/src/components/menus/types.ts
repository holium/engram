import store from "@/store/index";

import { suggestions } from "../document/prosemirror/suggestions";
import { view } from "../document/prosemirror/render"

import ContextMenuNode from "./ContextMenu.vue";
import SlashMenuNode from "./SlashMenu.vue";
import HighlightMenuNode from "./HighlightMenu.vue";
import EngramMenuNode from "./EngramMenu.vue";
import type { DocumentMeta } from "@/store/types";
import { insertPoint } from "prosemirror-transform";
import schema from "../document/prosemirror/schema";

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

export class HighlightMenu extends Menu {

    dom = HighlightMenuNode;
    from: number;
    to: number;

    constructor(location: { top: number, left: number }, from: number, to: number) {
        super(location, [], true);
        this.from = from;
        this.to = to;
    }
}

export class EngramMenu extends Menu {

    dom = EngramMenuNode;
    search: string;
    selected: number;

    constructor(location:  { top: number, left: number }, search: string, selected: number) {
        super(
            location, 
            [...store.getters['documents/list'].filter((doc: DocumentMeta) => {
                return doc.name.search(search) > -1;
            }).map((doc: DocumentMeta) => {
                return {
                    key: doc.id,
                    display: doc.name,
                    icon: "",
                    command: () => {
                        const pos = insertPoint(view.state.doc, view.state.selection.head, schema.nodes.engramlink);
                        if(pos) {
                            const tr = view.state.tr.insert(pos, schema.nodes.engramlink.create({ href: doc.id }));
                            view.dispatch(tr);
                        }
                    }
                }
            }), ...(search.match(/\/~[\w-]+\/\d/) == null ? [] : [{
                key: "wild",
                display: `link: ${search}`,
                icon: "",
                command: () => {
                    const pos = insertPoint(view.state.doc, view.state.selection.head, schema.nodes.engramlink);
                    if(pos) {
                        const tr = view.state.tr.insert(pos, schema.nodes.engramlink.create({ href: search }));
                        view.dispatch(tr);
                    }
                }
            }])],
            false);
        console.log("searching...: ", search);
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