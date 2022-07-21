import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// Build
import schema from "./build/schema.ts";
import { baseKeymap, buildKeymap } from "./build/keymap.ts";
import dispatchTransaction from "./build/dispatchTransaction.ts";
import { config } from "./plugins/config/plugin.ts"

//Plugins
import { collab } from "prosemirror-collab";
import { history } from "prosemirror-history"
import placeholders from "./plugins/placeholders.ts";
import shortcuts from "./plugins/shortcuts.ts";

const state = EditorState.create({
  schema: schema,
  plugins: [
    buildKeymap(schema),
    baseKeymap,
    shortcuts(schema),
    config(),
    placeholders,
    //sidemenu(setSideMenu),
    //highlightmenu(setHighlightMenu),
    //slashmenu(setNodeMenu, updateNodeMenu),
    //srcmenu(setSrcMenu),
    collab(),
    history({}),
  ],
});

const view = new EditorView(document.body, {
  state: state,
  dispatchTransaction: dispatchTransaction,
})
