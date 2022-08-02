import React from "react";
import { useEffect, useState } from "react";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// Build
import * as Y from "yjs";
import schema from "./build/schema.ts";
import { baseKeymap, buildKeymap } from "./build/keymap.ts";
import dispatchTransaction from "./build/dispatchTransaction.ts";
import { config } from "./plugins/config/plugin.ts";

//Plugins
import { collab } from "prosemirror-collab";
import { history } from "prosemirror-history";
import placeholders from "./plugins/placeholders.ts";
import shortcuts from "./plugins/shortcuts.ts";
import { comments } from "./plugins/comments.ts";
import { sync } from "./plugins/crdt/sync.ts";
import { localundo } from "./plugins/crdt/undo.ts";

// Menus
import sidemenu from "./plugins/menus/sidemenu.ts";
import SideMenu from "./plugins/menus/SideMenu.tsx";
import highlightmenu from "./plugins/menus/highlightmenu.ts";
import HighlightMenu from "./plugins/menus/HighlightMenu.tsx";
import slashmenu from "./plugins/menus/slashmenu.ts";
import NodeMenu from "./plugins/menus/NodeMenu.tsx";
import ConfigMenu from "./plugins/config/ConfigMenu.tsx";
import srcmenu from "./plugins/menus/srcmenu.ts";
import SrcMenu from "./plugins/menus/SrcMenu.tsx";

function Document() {
  const [view, setView] = useState(null);
  const [showConfig, setConfig] = useState(false);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [srcMenu, setSrcMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  const [configMenu, setConfigMenu] = useState(null);

  function hideSideMenu(event) {
    setSideMenu(null);
  }

  useEffect(() => {
    const doc = new Y.Doc();
    doc.clientID = 0; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");

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
        dispatchTransaction: dispatchTransaction,
      })
    );
  }, []);

  return (
    <div id="document-wrapper">
      {/* Document --------------------------------------------------------- */}
      <main id="document">
        {sideMenu ? (
          <SideMenu menu={sideMenu} hide={hideSideMenu} view={view} />
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
