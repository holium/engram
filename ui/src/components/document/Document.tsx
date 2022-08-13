import { useEffect, useState } from "react";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { getDocument, saveDocument, pathParser } from "../urbit/index";
// Build
import * as Y from "yjs";
import schema from "./build/schema";
import { baseKeymap, buildKeymap } from "./build/keymap";
import { config } from "./plugins/config/plugin";

//Plugins
import placeholders from "./plugins/placeholders";
import shortcuts from "./plugins/shortcuts";
import { comments } from "./plugins/comments";
//import { sync } from "./plugins/crdt/sync";
//import { localundo } from "./plugins/crdt/undo";
import { ySyncPlugin, yUndoPlugin, undo, redo } from "y-prosemirror";
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

function Document(props: { path: string }) {
  const [view, setView] = useState(null);

  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  const [configMenu, setConfigMenu] = useState(null);

  //Save
  const [saveFunc, setSaveFunc] = useState(null);
  useEffect(() => {
    return () => {
      console.log("save");
      if (saveFunc) saveFunc();
    };
  }, []);

  useEffect(() => {
    /**
     * Get encoded state from urbit
     * Y.applyUpdate(doc, state)
     **/
    if(saveFunc) saveFunc();
    if (props.path == null) return;
    if (view != null) view.destroy();
    const parsed = props.path.match(pathParser);
    console.log("parsed path:", parsed);
    const meta = {
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    };
    const doc = new Y.Doc();
    doc.clientID = 0; //(window as any).ship;
    doc.gc = false;
    getDocument(meta).then((res: any) => {
      const version = new Uint8Array(
        Object.keys(res.version).map((index: any) => {
          return res.version[index];
        })
      );
      const content = new Uint8Array(
        Object.keys(res.content).map((index: any) => {
          return res.content[index];
        })
      );
      const type = doc.getXmlFragment("prosemirror");
      const saveDoc = () => {
        const version = Y.encodeStateVector(doc);
        const content = Y.encodeStateAsUpdate(doc);

        saveDocument(meta, {
          version: Array.from(version),
          content: Array.from(content),
        });
      };
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
          //sync(type),
          //localundo(),
          ySyncPlugin(type),
          yUndoPlugin(),
          comments,
          handleImage,
          save(() => {
            const version = Y.encodeStateVector(doc);
            const content = Y.encodeStateAsUpdate(doc);

            saveDocument(meta, {
              version: Array.from(version),
              content: Array.from(content),
            });
          }),
        ],
      });
      const view = new EditorView(document.querySelector("#document"), {
        state: state,
      });
      console.log(view);
      Y.applyUpdate(doc, content);
      setView(view);
    });
  }, [props.path]);

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
