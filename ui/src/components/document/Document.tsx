import React from "react";
import { useEffect, useState } from "react";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// Build
import * as Y from "yjs";
import schema from "./build/schema";
import { baseKeymap, buildKeymap } from "./build/keymap";
import { config } from "./plugins/config/plugin";

//Plugins
import { collab } from "prosemirror-collab";
import { history } from "prosemirror-history";
import placeholders from "./plugins/placeholders";
import shortcuts from "./plugins/shortcuts";
import { comments } from "./plugins/comments";
import { sync } from "./plugins/crdt/sync";
import { localundo } from "./plugins/crdt/undo";

// Menus
import sidemenu from "./plugins/menus/sidemenu";
import SideMenu from "./plugins/menus/SideMenuNode";
import highlightmenu from "./plugins/menus/highlightmenu";
import HighlightMenu from "./plugins/menus/HighlightMenuNode";
import slashmenu from "./plugins/menus/slashmenu";
import NodeMenu from "./plugins/menus/NodeMenuNode";
import ConfigMenu from "./plugins/config/ConfigMenu";
import srcmenu from "./plugins/menus/srcmenu";
import SrcMenu from "./plugins/menus/SrcMenuNode";

function Document() {
  const [view, setView] = useState(null);
  const [doc, setDoc] = useState(null);

  const [showConfig, setConfig] = useState(false);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [srcMenu, setSrcMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  const [configMenu, setConfigMenu] = useState(null);

  function pull(update) {
    // to be called from a wrapper w/ an encoded update from urbit
    Y.applyUpdate(doc, update);
  }

  function stage() {
    const state = Y.encodeStateAsUpdateV2(doc);
    const version = Y.encodeStateVector(doc);
    // send them to urbit
  }

  useEffect(() => {
    setDoc(new Y.Doc());
    doc.clientID = 0; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");

    /**
     * Get encoded state
     * Y.applyUpdate(doc, state)
     **/

    const state = EditorState.create({
      schema: schema,
      plugins: [
        buildKeymap(schema),
        baseKeymap,
        shortcuts(schema),
        config(setConfigMenu),
        placeholders,
        sidemenu(setSideMenu),
        highlightmenu(setHighlightMenu),
        slashmenu(setNodeMenu, setNodeMenuSearch),
        srcmenu(setSrcMenu),
        sync(type),
        localundo(),
        comments,
      ],
    });
    setView(
      new EditorView(document.querySelector("#document"), {
        state: state,
      })
    );
  }, []);

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
        {srcMenu ? <SrcMenu menu={srcMenu} view={view} /> : ""}
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
