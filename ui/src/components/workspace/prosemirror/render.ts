import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";
import save from "./save";
import bauble from "./bauble";
import type { BaubleUpdate } from "./bauble";

export default function (
  place: HTMLElement,
  updateBauble: (bauble: BaubleUpdate) => void
): EditorView {
  console.log(place);
  const state = EditorState.create({
    schema: schema,
    plugins: [
      keymap,
      shortcuts,
      save((view) => {
        console.log("Saving...");
      }),
      // ux
      bauble(updateBauble),
    ],
  });
  const view = new EditorView(place, {
    state,
  });
  return view;
}
