import React from "react";
import { useEffect, useState } from "react";
import Config from "./Config.tsx";

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
      <article id="document" style={{ position: "relative" }}>
        {sideMenu ? (
          <SideMenu
            style={{
              top: `${sideMenu.top}px`,
            }}
            hide={hideSideMenu}
          />
        ) : (
          ""
        )}
        {highlightMenu ? (
          <HighlightMenu
            style={{
              left: `${highlightMenu.left}px`,
              top: `calc(${highlightMenu.top}px - 1em - 12px)`,
            }}
          />
        ) : (
          ""
        )}
        <div className="text-center my-3">
          <div className="inline-block px-3 py-2 border rounded-2 border-type">
            connected
          </div>
        </div>
      </article>
    </div>
  );
}
export default Document;