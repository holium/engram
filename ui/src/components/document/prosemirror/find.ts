import { AllSelection, Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const FindPluginKey = new PluginKey("find");

let search = ""; 

export const find = (openFinder: (querier: (query: string) => void) => void) => new Plugin({
    key: FindPluginKey,
    props: {
        handleKeyDown(view, event) {
            if(event.key == "f" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                openFinder((query: string) => {
                    search = query;
                    const tr = view.state.tr.setMeta(FindPluginKey, "finding...");
                    view.dispatch(tr);
                });
            }
        },
        decorations(state) {
            const decos: Array<Decoration> = [];

            const searcher = (offset: number) => (node: any, pos: number) => {
                if(node.type.name == "text") {
                    const finder = (str: string, finderOffset: number) => {
                        const res = str.search(search);
                        if(res >= 0) {
                            decos.push(Decoration.inline(
                                offset + pos + res + finderOffset, 
                                offset + pos + res + finderOffset + search.length ,
                                { class: "found-text" }
                            ));
                            finder(str.substring(finderOffset + res + search.length), finderOffset + res + search.length);
                        }
                    }
                    finder(node.text, 0);
                } else {
                    node.descendants(searcher(offset + pos + 1));
                }
                return false;
            }

            if(search.length > 0) state.doc.descendants(searcher(0));

            return DecorationSet.create(state.doc, decos)
        },
    }
});

export default find;