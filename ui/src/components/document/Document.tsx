import React from "react";
import { useEffect, useState } from "react";

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


// Menus
import sidemenu from "./plugins/menus/sidemenu.ts";
import SideMenu from "./plugins/menus/SideMenu.tsx";
import highlightmenu from "./plugins/menus/highlightmenu.ts";
import HighlightMenu from "./plugins/menus/HighlightMenu.tsx";
import slashmenu from "./plugins/menus/slashmenu.ts"
import NodeMenu from "./plugins/menus/NodeMenu.tsx"
import ConfigMenu from "./plugins/config/ConfigMenu.tsx"
import srcmenu from "./plugins/menus/srcmenu.ts"
import SrcMenu from "./plugins/menus/SrcMenu.tsx"


function Document() {

  const [view, setView] = useState(null);
  const [showConfig, setConfig] = useState(false);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [srcMenu, setSrcMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  function updateNodeMenu(search: string | null) {
    console.log("updating search", search, nodeMenuSearch)
    if(search == null) setNodeMenuSearch("")
    else setNodeMenuSearch(`${nodeMenuSearch}${search}`)
  }
  const [configMenu, setConfigMenu] = useState(null);

  function toggleConfig() {
    setConfig(!showConfig);
  }
  function hideSideMenu(event) {
    setSideMenu(null);
  }
  function initDrag(event) {
    console.log(event);
    const dom = view.domAtPos(sidemenu.pos);
    console.log(dom);
  }

  useEffect(() => {
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
        slashmenu(setNodeMenu, updateNodeMenu),
        srcmenu(setSrcMenu),
        collab(),
        history({}),
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
      <section>
        {sideMenu ? (
          <SideMenu
            menu={sideMenu}
            hide={hideSideMenu}
            view={view}
          />
        ) : (
          ""
        )}
        {highlightMenu ? (
          <HighlightMenu
            menu={highlightMenu}
            view={view}
          />
        ) : (
          ""
        )}
        {srcMenu ? (
          <SrcMenu
            menu={srcMenu}
            view={view}
          />
        ) : (
          ""
        )}
        {nodeMenu ? (
          <NodeMenu
            menu={nodeMenu}
            search={nodeMenuSearch}
            hide={() => {setNodeMenu(null); updateNodeMenu(null);}}
            view={view}
            />
        ) :(
          ""
        )}
        {configMenu ? (
          <ConfigMenu
            menu={configMenu}
            hide={() => {setConfigMenu(null);}}
            view={view}
            />
        ) :(
          ""
        )}
      </section>

      </main>
    </div>
  );
}
export default Document;
