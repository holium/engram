import { useEffect, useState, useContext } from "react";

import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { getDocument, saveDocument, recordSnapshot } from "../urbit/index";
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
import {
  ySyncPlugin,
  yUndoPlugin,
  undo,
  redo,
  yDocToProsemirror,
} from "y-prosemirror";
import { handleImage } from "./plugins/handleImage";
import { save, SavePluginKey } from "./plugins/save";

// Menus
import sidemenu from "./plugins/menus/sidemenu";
import SideMenu from "./plugins/menus/SideMenuNode";
import highlightmenu from "./plugins/menus/highlightmenu";
import HighlightMenu from "./plugins/menus/HighlightMenuNode";
import slashmenu from "./plugins/menus/slashmenu";
import NodeMenu from "./plugins/menus/NodeMenuNode";

//Toolbar
import Toolbar from "../toolbar/Toolbar";
import PublishPanel from "../panels/PublishPanel";
import UpdatePanel from "../panels/UpdatePanel";
import VersionPanel from "../panels/VersionPanel";
import ConfigPanel from "../panels/ConfigPanel";
import { NotifStatus } from "./types";
import { SlideContext } from "../toolbar/SlideContext";

function Document(props: { path: DocumentId }) {
  /* Periphery -------------------------------------------------------------- */

  // Menus
  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");

  // Panel
  const [panel, setPanel] = useState(null);

  // Notifications
  const [notifStatus, setNotifStatus] = useState(false);

  // Snapshots
  const [snapshot, setSnapshot] = useState(null);

  // Document
  const [view, setView] = useState(null);
  const [doc, setDoc] = useState(null);

  function renderSnapshot(snapshot: Y.Snapshot) {
    if (props.path == null) return;
    console.log(view, "should destroy view: ", view != null);
    if (view != null) view.destroy();

    const doc = new Y.Doc();
    doc.clientID = 0; //(window as any).ship;
    doc.gc = false;
    getDocument(props.path).then((res: any) => {
      const content = new Uint8Array(JSON.parse(res.content));
      Y.applyUpdate(doc, content);
      const version = Y.createDocFromSnapshot(doc, snapshot);
      const rendering = yDocToProsemirror(schema, version);

      const state = EditorState.create({
        schema: schema,
        doc: rendering,
        plugins: [config],
      });
      if (view != null) view.destroy();
      setView(
        new EditorView(document.querySelector("#document"), {
          state,
          plugins: [
            new Plugin({
              props: {
                editable: () => {
                  return false;
                },
              },
            }),
          ],
        })
      );
    });
  }
  function closeSnapshot() {
    setup();
  }

  // Setup
  function setup() {
    if (props.path == null) return;

    const doc = new Y.Doc();
    doc.clientID = 0; //(window as any).ship;
    doc.gc = false;
    getDocument(props.path).then((res: any) => {
      const version = new Uint8Array(
        Object.keys(res.version).map((index: any) => {
          return res.version[index];
        })
      );
      const content = new Uint8Array(JSON.parse(res.content));
      const type = doc.getXmlFragment("prosemirror");
      const saveDoc = () => {
        const version = Y.encodeStateVector(doc);
        const content = Y.encodeStateAsUpdate(doc);

        saveDocument(meta, {
          version: Array.from(version),
          content: JSON.stringify(content),
        });
      };
      const state = EditorState.create({
        schema: schema,
        plugins: [
          buildKeymap(schema),
          baseKeymap,
          shortcuts(schema),
          config,
          placeholders,
          sidemenu(setSideMenu),
          highlightmenu(setHighlightMenu),
          slashmenu(setNodeMenu, setNodeMenuSearch),
          ySyncPlugin(type),
          yUndoPlugin(),
          comments,
          handleImage,
          save(() => {
            const version = Y.encodeStateVector(doc);
            const content = Y.encodeStateAsUpdate(doc);
            const snapshot = Array.from(Y.encodeSnapshotV2(Y.snapshot(doc)));

            saveDocument(props.path, {
              version: Array.from(version),
              content: Array.from(content),
            });
            recordSnapshot(props.path, {
              date: Date.now(),
              ship: `~${(window as any).ship}`,
              data: snapshot,
            });
          }),
        ],
      });
      Y.applyUpdate(doc, content);
      const collection = document.getElementsByClassName("ProseMirror");
      console.log("prosemirrors: ", collection);
      Array.from(collection).forEach((element) => {
        element.remove();
      });
      const newView = new EditorView(document.querySelector("#document"), {
        state: state,
      });
      setView(newView);
      setDoc(doc);
    });
  }

  useEffect(() => {
    setup();
  }, [props.path]);

  const { slide, setSlide } = useContext(SlideContext);
  function toggleSidebar() {
    setSlide(!slide);
  }

  /* Empty Page ------------------------------------------------------------- */
  if (props.path == null) {
    return (
      <div id="workspace">
        <div id="toolbar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon clickable"
            onClick={toggleSidebar}
            fill="var(--type-color)"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
          </svg>
        </div>
        <div
          className="flex flex-grow items-center justify-center"
          style={{ color: "var(--glass-color)" }}
        >
          create a new document
        </div>
      </div>
    );
  }

  return (
    <div id="workspace">
      <Toolbar
        path={props.path}
        openPanel={setPanel}
        panel={panel}
        notifs={notifStatus}
      />
      <PublishPanel show={panel == "publish"} path={props.path} />
      <UpdatePanel
        path={props.path}
        show={panel == "update"}
        save={() => {
          console.log(view.state);
        }}
        getStage={
          /* getStage */ () => {
            return 0;
          }
        }
        applyUpdate={(update: Uint8Array, from: string) => {
          console.log("applying update:", update);
          Y.applyUpdate(doc, update);

          const version = Y.encodeStateVector(doc);
          const content = Y.encodeStateAsUpdate(doc);
          const snapshot = Array.from(Y.encodeSnapshotV2(Y.snapshot(doc)));

          saveDocument(props.path, {
            version: Array.from(version),
            content: Array.from(content),
          });
          recordSnapshot(props.path, {
            date: Date.now(),
            ship: `~${from}`,
            data: snapshot,
          });
          return doc;
        }}
        setNotifStatus={/* setNotifStatus */ () => {}}
      />

      <VersionPanel
        show={panel == "version"}
        path={props.path}
        renderSnapshot={renderSnapshot}
        closeSnapshot={closeSnapshot}
      />
      <ConfigPanel show={panel == "config"} view={view} />

      <div id="document-wrapper">
        {/* Document --------------------------------------------------------- */}
        <main
          id="document"
          onMouseLeave={() => {
            setSideMenu(null);
          }}
        >
          {sideMenu ? (
            <SideMenu
              menu={sideMenu}
              hide={() => {
                console.log("hiding");
                setSideMenu(null);
              }}
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
        </main>
      </div>
    </div>
  );
}
export default Document;
