import { useEffect, useState, useContext } from "react";
import { OpenDocumentEvent } from "../document/types";
import { DocumentId } from "./types";
import suggestions from "./plugins/menus/suggestions";

import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  getDocument,
  getDocumentSettings,
  saveDocument,
  recordSnapshot,
  sendUpdate,
  createDocument,
  checkUrbitWindow,
} from "../urbit/index";
// Build
import * as Y from "yjs";
import schema from "./prosemirror/schema";
import keymap from "./prosemirror/keymap";
import { keymap as pkeymap } from "prosemirror-keymap";
import config from "./prosemirror/config/plugin";

//Plugins
import placeholders from "./prosemirror/placeholders";
import shortcuts from "./prosemirror/shortcuts";
import markup from "./prosemirror/markup";
import imageView from "./prosemirror/imageView";
import urbitlink from "./prosemirror/urbitlink";
import { dropCursor } from "prosemirror-dropcursor";
import { sync } from "./prosemirror/crdt/sync";
import { localundo } from "./prosemirror/crdt/undo";
import { redo, yDocToProsemirror } from "y-prosemirror";
import { save, SavePluginKey } from "./prosemirror/save";
import {
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
} from "prosemirror-commands";
import { splitListItem } from "prosemirror-schema-list";

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

function Document(props: { path: DocumentId; refresh: () => void }) {
  /* Create Doc ------------------------------------------------------------- */
  async function createDoc() {
    checkUrbitWindow();

    const doc = new Y.Doc();
    doc.clientID = (window as any).ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const version = Y.encodeStateVector(doc);
    const encoding = Y.encodeStateAsUpdate(doc);

    const { id, settings } = await createDocument("New Document", {
      version: Array.from(version),
      content: JSON.stringify(Array.from(encoding)),
    });
    props.refresh();
    document.dispatchEvent(OpenDocumentEvent(null, id));
  }

  /* Periphery -------------------------------------------------------------- */

  // Menus
  const [sideMenu, setSideMenu] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [nodeMenu, setNodeMenu] = useState(null);
  const [nodeMenuSearch, setNodeMenuSearch] = useState("");
  const [tabIndex, tabMenu] = useState(0);
  const [runSelectNodeMenu, setRunSelectNodeMenu] = useState(0);
  const [slashMenuEvent, reportSlashMenuEvent] = useState(null);
  const [showComments, setShowComments] = useState(false);

  // Panel
  const [panel, setPanel] = useState(null);

  // Notifications
  const [notifStatus, setNotifStatus] = useState(false);

  // Snapshots
  const [snapshot, setSnapshot] = useState(null);

  // Document
  const [view, setView] = useState(null);
  const [doc, setDoc] = useState(null);
  const [sub, setSub] = useState(null);
  const [settings, setSettings] = useState({
    name: "",
    owner: "",
    perms: [],
  });

  function renderSnapshot(snapshot: Y.Snapshot) {
    if (props.path == null) return;
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
      setDoc(doc);
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
    getDocumentSettings(props.path).then((stg) => {
      setSettings(stg);
      getDocument(props.path).then((res: any) => {
        const version = new Uint8Array(
          Object.keys(res.version).map((index: any) => {
            return res.version[index];
          })
        );
        const content = new Uint8Array(JSON.parse(res.content));
        const type = doc.getXmlFragment("prosemirror");
        const state = EditorState.create({
          schema: schema,
          plugins: [
            keymap,
            shortcuts,
            config,
            placeholders,
            sidemenu(setSideMenu),
            highlightmenu(setHighlightMenu),
            slashmenu(
              setNodeMenu,
              //setNodeMenuSearch,
              //tabMenu,
              reportSlashMenuEvent
            ),
            sync(type),
            localundo(),
            dropCursor({ width: 2, color: "var(--rlm-accent-color, #38bdf8)" }),
            markup,
            imageView,
            urbitlink,
            save(() => {
              const version = Y.encodeStateVector(doc);
              const content = Y.encodeStateAsUpdate(doc);
              const snapshot = Y.snapshot(doc);

              getDocument(props.path).then((res) => {
                const update = Y.encodeStateAsUpdate(
                  doc,
                  new Uint8Array(Object.values((res as any).version))
                );
                saveDocument(props.path, {
                  version: Array.from(version),
                  content: JSON.stringify(Array.from(content)),
                });
                recordSnapshot(props.path, {
                  time: new Date(),
                  ship: `~${(window as any).ship}`,
                  snapshot: snapshot,
                });

                sendUpdate(props.path, {
                  author: "~" + (window as any).ship,
                  content: update,
                  time: new Date(),
                });
              });
            }),
          ],
        });
        Y.applyUpdate(doc, content);
        const collection = document.getElementsByClassName("ProseMirror");
        Array.from(collection).forEach((element) => {
          element.remove();
        });
        const newView = new EditorView(document.querySelector("#document"), {
          state: state,
        });
        Y.applyUpdate(doc, content);
        setView(newView);
        setDoc(doc);
      });
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
            className={`icon clickable sidebar-toggle ${
              slide ? "sidebar-toggle-hidden" : ""
            }`}
            onClick={toggleSidebar}
            fill="var(--type-color)"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
          </svg>
        </div>
        <div
          className="flex flex-col gap-4 flex-grow items-center justify-center"
          style={{ color: "var(--border-color)", fontWeight: "500" }}
        >
          No Open Document
          <div
            onClick={createDoc}
            className="border rounded-2 clickable font-bold px-5 py-4"
            style={{ borderColor: "var(--type-color)", fontSize: "20px" }}
          >
            Create One
          </div>
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
        settings={settings}
        showComments={setShowComments}
        showingComments={showComments}
      />
      <PublishPanel
        show={panel == "publish"}
        path={props.path}
        settings={settings}
      />
      <UpdatePanel
        path={props.path}
        show={panel == "update"}
        settings={settings}
        applyUpdate={(update: Uint8Array, from: string) => {
          Y.applyUpdate(doc, update);

          const version = Y.encodeStateVector(doc);
          const content = Y.encodeStateAsUpdate(doc);
          const snapshot = Y.snapshot(doc);

          saveDocument(props.path, {
            version: Array.from(version),
            content: JSON.stringify(Array.from(content)),
          });
          recordSnapshot(props.path, {
            time: new Date(),
            ship: `~${from}`,
            snapshot: snapshot,
          });
          return doc;
        }}
      />
      <VersionPanel
        show={panel == "version"}
        id={props.path}
        renderSnapshot={renderSnapshot}
        closeSnapshot={closeSnapshot}
      />
      <ConfigPanel show={panel == "config"} view={view} />
      <div id="document-wrapper" className="scrollbar-small">
        <main
          id="document"
          className={`${
            showComments ? "" : "hide-comments"
          } realm-cursor-text-cursor`}
          onMouseLeave={() => {
            setSideMenu(null);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter" && nodeMenu == null) {
              chainCommands(
                newlineInCode,
                splitListItem(schema.nodes["li"]),
                createParagraphNear,
                liftEmptyBlock,
                splitBlock
              )(view.state, view.dispatch, view);
            }
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
              tabIndex={tabIndex}
              hideOnBlur={false}
              runSelect={runSelectNodeMenu}
              slashEvent={slashMenuEvent}
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
