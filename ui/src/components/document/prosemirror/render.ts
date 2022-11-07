import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import * as Y from "yjs"
import { ySyncPlugin, undo, redo } from "y-prosemirror";

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


export let view: EditorView;

export default function (
  place: HTMLElement,
  content: Uint8Array,
  updateBauble: (bauble: BaubleUpdate) => void,
  updateCover: (cover: CoverUpdate) => void,
  updateStyling: (styling: StylingUpdate) => void
): EditorView {
  const doc = new Y.Doc();
  doc.clientID = 0;
  doc.gc = false;
  const type = doc.getXmlFragment("prosemirror");
  console.log("applying update", content);

  const state = EditorState.create({
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

        store.dispatch("workspace/revisions/snapshot", {
          id: `/${router.currentRoute.value.params.author}/${router.currentRoute.value.params.clock}`,
          snapshot: snapshot
        });
      }),
      // CRDT
      ySyncPlugin(type),
      // Views
      cover(updateCover),
      styling(updateStyling),
      // ux
      bauble(updateBauble),
    ],
  });
  view = new EditorView(place, {
    state,
  });
  Y.applyUpdate(doc, content);
  return view;
}
