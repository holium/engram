import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import * as Y from "yjs"
import { ySyncPlugin, yUndoPlugin } from "y-prosemirror";

import store from "@/store/index";
import router from "@/router/index";

import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";
import save from "./save";
import bauble from "./bauble";
import type { BaubleUpdate } from "./bauble";
import cover from "./cover";
import type { CoverUpdate } from "./cover"
import styling from "./styling";
import type { StylingUpdate } from "./styling"
import type { DocumentUpdate, DocumentVersion } from "@/store/types";
import type { Menu } from "../../menus/types";

import slashmenu from "./slashmenu";


export let view: EditorView;

export default function (
  place: HTMLElement,
  content: Uint8Array,
  pushMenu: (menu: Menu | null) => void,
  updateBauble: (bauble: BaubleUpdate) => void,
  updateCover: (cover: CoverUpdate) => void,
  updateStyling: (styling: StylingUpdate) => void,
  snapshot: null | DocumentVersion,
): EditorView {
  if(view) view.destroy();
  const doc = new Y.Doc();
  doc.clientID = 0;
  doc.gc = false;
  if(content.length > 0) Y.applyUpdate(doc, content);
  
  console.log("applying update", content);

  let state;
  if(snapshot == null) {
    const type = doc.getXmlFragment("prosemirror");
    store.getters["documents/updates"](`/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`).then((updates: Array<DocumentUpdate>) => {
      console.log("updates: ", updates);
      updates.forEach((update: DocumentUpdate) => {
        Y.applyUpdate(doc, update.content);
        const snapshot = Y.snapshot(doc);
        store.dispatch("workspace/revisions/snap", {
          id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
          author: update.author,
          snapshot: snapshot
        });
        store.dispatch("workspace/reveisions/accept", {
          id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
          update: update,
        })
      })
  
      if(updates.length > 0) {
        const version = Y.encodeStateVector(doc);
        const content = Y.encodeStateAsUpdate(doc);
    
        store.dispatch("documents/save", {
          id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
          version: version,
          content: content
        });
      }
    })

    state = EditorState.create({
      schema: schema,
      plugins: [
        keymap,
        shortcuts,
        save((view) => {
          console.log("Saving...");
          const version = Y.encodeStateVector(doc);
          const content = Y.encodeStateAsUpdate(doc);
          const snapshot = Y.snapshot(doc);
          console.log("content: ", content);
          store.dispatch("documents/save", {
            id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
            version: version,
            content: content
          });
  
          store.dispatch("workspace/revisions/snap", {
            id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
            snapshot: snapshot
          });
        }),
        // CRDT
        ySyncPlugin(type),
        yUndoPlugin(),
        // Views
        cover(updateCover),
        styling(updateStyling),
        // ux
        bauble(updateBauble),
        slashmenu(pushMenu)
      ],
    });
  } else {
    console.log(snapshot.snapshot)
    const preview = Y.createDocFromSnapshot(doc, snapshot.snapshot)
    const type = preview.getXmlFragment("prosemirror");
    state = EditorState.create({
      schema: schema,
      plugins: [
        // CRDT
        ySyncPlugin(type),
        // Views
        cover(updateCover),
        styling(updateStyling),
      ],
    });
  }
  

  
  view = new EditorView(place, {
    state,
  });
  return view;
}
