import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import * as Y from "yjs"
import { ySyncPlugin, yUndoPlugin } from "y-prosemirror";
import { dropCursor } from "prosemirror-dropcursor";

import store from "@/store/index";
import type { DocumentUpdate, DocumentVersion } from "@/store/document";

import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";
import save from "./save";
import cover from "./cover";
import type { CoverUpdate } from "./cover"
import type { Menu } from "../../menus/types";

import slashmenu from "./slashmenu";
import highlightmenu from "./highlightmenu"
import engram from "./engramview";
import comments from "./comments";
import imageview from "./imageview";
import find from "./find";


export let view: EditorView;
export let pushUpdate = (id: string, update: string, clear?: boolean) => {
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
      if(res == "missing") {
        reject("missing");
      } else {
        if(view) view.destroy();
        const doc = new Y.Doc();
        Object.assign(doc, {documentId: path});
        doc.clientID = 0;
        doc.gc = false;

        // Publish the push update
        console.warn("document response: ", res)
        pushUpdate = (id: string, update: string, clear?: boolean) => {
          if((doc as any).documentId == id) {
            const content = new Uint8Array(JSON.parse(update));
            if(content.length > 0) {
              Y.applyUpdate(doc, content);
            }
          }
        }

        // Load the document
        Object.keys(res).map((key: string) => { return res[key] }).forEach((update: any) => {
          pushUpdate(path, update);
        });
        //store.dispatch("document/acceptupdates", path);

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
                (window as any).urbit.scry({ app: "engram", path: `/document${path}/version`}).then((oldversion: string) => {
                  const old = new Uint8Array(JSON.parse(oldversion));
                  console.warn("got old version: ", old);
                  const version = Y.encodeStateVector(doc);
                  const content = old.length > 0 ? Y.encodeStateAsUpdate(doc, old) : Y.encodeStateAsUpdate(doc);
                  const snapshot = Y.snapshot(doc);
                  store.dispatch("document/save", {
                    id: path,
                    version: version,
                    content: content
                  });
                })
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
