import React from "react";
import { useEffect, useState } from "react";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// Build
import schema from "./build/schema.ts";
import { baseKeymap, buildKeymap } from "./build/keymap.ts";
import dispatchTransaction from "./build/dispatchTransaction.ts";
import { config } from "./build/config.ts"

//Plugins
import { collab } from "prosemirror-collab";
import { history } from "prosemirror-history"
import placeholders from "./plugins/placeholders.ts";
import shortcuts from "./plugins/shortcuts.ts";


// Menus
import sidemenu from "./plugins/sidemenu.ts";
import SideMenu from "./plugins/SideMenu.tsx";
import highlightmenu from "./plugins/highlightmenu.ts";
import HighlightMenu from "./plugins/HighlightMenu.tsx";
import slashmenu from "./plugins/slashmenu.ts"
import NodeMenu from "./plugins/NodeMenu.tsx"
import srcmenu from "./plugins/srcmenu.ts"
import SrcMenu from "./plugins/SrcMenu.tsx"


function Document() {

  const [view, setView] = useState(null);
  const [showConfig, setConfig] = useState(false);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [srcMenu, setSrcMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  function updateNodeMenu(search: string | null) {
    if(search == null) setNodeMenuSearch("")
    else setNodeMenuSearch(`${nodeMenuSearch}${search}`)
  }

  function toggleConfig() {
    setConfig(!showConfig);
  }
  function hideSideMenu(event) {
    //setSideMenu(null);
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
        config("#document"),
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
    <div>
      <section
        style={{
          position: "absolute",
          left: "calc(50% + 30ch)",
          width: "50ch",
        }}
      >
      </section>
      <main id="document" style={{ position: "relative" }}>
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
        <div className="text-center my-3">
          <div className="inline-block px-3 py-2 border rounded-2 border-type">
            connected
          </div>
        </div>
      </main>
    </div>
  );
}
export default Document;
