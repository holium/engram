import { useEffect, useState } from "react";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// Build
import * as Y from "yjs";
import schema from "./build/schema";
import { baseKeymap, buildKeymap } from "./build/keymap";
import { config } from "./plugins/config/plugin";

//Plugins
import placeholders from "./plugins/placeholders";
import shortcuts from "./plugins/shortcuts";
import { comments } from "./plugins/comments";
import { sync } from "./plugins/crdt/sync";
import { localundo } from "./plugins/crdt/undo";
import { handleImage } from "./plugins/handleImage";
import save from "./plugins/save";

// Menus
import sidemenu from "./plugins/menus/sidemenu";
import SideMenu from "./plugins/menus/SideMenuNode";
import highlightmenu from "./plugins/menus/highlightmenu";
import HighlightMenu from "./plugins/menus/HighlightMenuNode";
import slashmenu from "./plugins/menus/slashmenu";
import NodeMenu from "./plugins/menus/NodeMenuNode";
import ConfigMenu from "./plugins/config/ConfigMenu";

function Document(props: { type: Y.XmlFragment; save: () => void }) {
  console.log(props.type);
  const [view, setView] = useState(null);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  const [configMenu, setConfigMenu] = useState(null);

  useEffect(() => {
    /**
     * Get encoded state from urbit
     * Y.applyUpdate(doc, state)
     **/
    if(view != null) view.destroy();
    const state = EditorState.create({
      schema: schema,
      plugins: [
        buildKeymap(schema),
        baseKeymap,
        shortcuts(schema),
        //config(setConfigMenu),
        //placeholders,
        sidemenu(setSideMenu),
        highlightmenu(setHighlightMenu),
        slashmenu(setNodeMenu, setNodeMenuSearch),
        //srcmenu(setSrcMenu),
        sync(props.type),
        localundo(),
        comments,
        handleImage,
        save(props.save),
      ],
    });
    setView(
      new EditorView(document.querySelector("#document"), {
        state: state,
      })
    );
  }, [props.type]);

  return (
    <div id="document-wrapper">
      {/* Document --------------------------------------------------------- */}
      <main id="document">
        {sideMenu ? (
          <SideMenu
            menu={sideMenu}
            hide={() => setSideMenu(null)}
            view={view}
          />
        ) : (
          ""
        )}
        {highlightMenu ? (
          <HighlightMenu menu={highlightMenu} view={view} />
        ) : (
          ""
        )}
        {nodeMenu ? (
          <NodeMenu
            menu={nodeMenu}
            search={nodeMenuSearch}
            hide={() => {
              setNodeMenu(null);
              setNodeMenuSearch("");
            }}
            view={view}
          />
        ) : (
          ""
        )}
        {configMenu ? (
          <ConfigMenu
            menu={configMenu}
            hide={() => {
              setConfigMenu(null);
            }}
            view={view}
          />
        ) : (
          ""
        )}
      </main>
    </div>
  );
}
export default Document;
