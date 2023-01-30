import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import * as Y from "yjs"
import { ySyncPlugin, yUndoPlugin } from "y-prosemirror";
import { dropCursor } from "prosemirror-dropcursor";

import store from "@/store/index";
import router from "@/router/index";

import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";
import save from "./save";
import cover from "./cover";
import type { CoverUpdate } from "./cover"
import styling from "./styling";
import type { StylingUpdate } from "./styling"
import type { DocumentUpdate, DocumentVersion } from "@/store/types";
import type { Menu } from "../../menus/types";

import slashmenu from "./slashmenu";
import highlightmenu from "./highlightmenu"
import engram from "./engramview";
import comments from "./comments";
import imageview from "./imageview";
import find from "./find";


export let view: EditorView;
export let pushUpdate = (update: DocumentUpdate) => {
  //
} 

export default function (
  place: HTMLElement,
  path: string,
  pushMenu: (menu: Menu | null) => void,
  updateCover: (cover: CoverUpdate) => void,
  //updateStyling: (styling: StylingUpdate) => void,
  openFinder: (querier: (query: string) => void) => void,
  snapshot: null | DocumentVersion,
  editable: boolean,
): Promise<EditorView> {
  return new Promise((resolve, reject) => {
    store.getters["document/get"](path).then((res: any) => {
      console.log("document get result", res);
      if(res == "missing") {
        reject("missing");
      } else {
        if(view) view.destroy();
        const doc = new Y.Doc();
        Object.assign(doc, {documentId: path});
        doc.clientID = 0;
        doc.gc = false;
        const cont = new Uint8Array(JSON.parse(res.content));
        // Load the document
        if(cont.length > 0) Y.applyUpdate(doc, cont);

        // Publish the push update
        pushUpdate = (update: DocumentUpdate, clear?: boolean) => {
          if(update.content.length > 0) {
            Y.applyUpdate(doc, update.content);
            const snapshot = Y.snapshot(doc);
            store.dispatch("document/snap", {
              id: path,
              author: update.author,
              snapshot: snapshot
            });

            if(clear) 
              store.dispatch("document/acceptupdates", path);
          }
        }

        // Push current updates
        Object.keys(res.updates).map((key: string) => { return res.updates[key] }).forEach(pushUpdate);
        store.dispatch("document/acceptupdates", {
          id: path,
        })

        let state;
        if(snapshot == null) {
          const type = doc.getXmlFragment("prosemirror");     

          state = EditorState.create({
            schema: schema,
            plugins: [
              keymap,
              shortcuts,
              imageview,
              find(openFinder),
              save((view) => {
                const version = Y.encodeStateVector(doc);
                const content = Y.encodeStateAsUpdate(doc);
                const snapshot = Y.snapshot(doc);
                store.dispatch("document/save", {
                  id: path,
                  version: version,
                  content: content
                });
        
                store.dispatch("document/snap", {
                  id: path,
                  snapshot: snapshot
                });
              }),
              // CRDT
              ySyncPlugin(type),
              yUndoPlugin(),
              // Views
              cover(updateCover),
              //styling(updateStyling),
              // ux
              slashmenu(pushMenu),
              highlightmenu(pushMenu),
              dropCursor(),
              engram,
              comments,
            ],
          });
          /*
        (async (activepath: string) => {
          store.getters["documents/updates"](path).then((updates: Array<DocumentUpdate>) => {
            console.log("updates: ", updates);
            updates.forEach(pushUpdate);
            store.dispatch("workspace/revisions/accept", {
              id: path,
            })
      
            if(updates.length > 0) {
              const version = Y.encodeStateVector(doc);
              const content = Y.encodeStateAsUpdate(doc);
          
              store.dispatch("documents/save", {
                id: path,
                version: version,
                content: content
              });
            }
          })
        })(path)
        */
      } else {
        const preview = Y.createDocFromSnapshot(doc, snapshot.snapshot)
        const type = preview.getXmlFragment("prosemirror");
        state = EditorState.create({
          schema: schema,
          plugins: [
            find(openFinder),
            // CRDT
            ySyncPlugin(type, {}),
            // Views
            cover(updateCover),
            //styling(updateStyling),
          ],
        });
      }
      
      view = new EditorView(place, {
        editable: () => { return editable },
        state,
      });
      resolve(view);
      }
    })
  })
}
