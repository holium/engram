import React from "react";
import { useEffect, useState } from "react";
import Config from "../config/Config.tsx";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "./build/schema.ts";
import shortcuts from "./plugins/shortcuts.ts";
import { baseKeymap, buildKeymap } from "./build/keymap.ts";
import dispatchTransaction from "./build/dispatchTransaction.ts";

import placeholders from "./plugins/placeholders.ts";
import sidemenu from "./plugins/sidemenu.ts";
import SideMenu from "./plugins/SideMenu.tsx";
import highlightmenu from "./plugins/highlightmenu.ts";
import HighlightMenu from "./plugins/HighlightMenu.tsx";

import { collab } from "prosemirror-collab";

function Document() {

  const [view, setView] = useState(null);
  const [showConfig, setConfig] = useState(false);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);

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
        placeholders,
        sidemenu(setSideMenu),
        highlightmenu(setHighlightMenu),
        collab(),
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
        <button onClick={toggleConfig}>{showConfig ? "hide" : "config"}</button>
        {showConfig ? <Config view={view} dev={true} /> : ""}
      </section>
      <main id="document" style={{ position: "relative" }}>
        {sideMenu ? (
          <SideMenu
            menu={sideMenu}
            hide={hideSideMenu}
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
