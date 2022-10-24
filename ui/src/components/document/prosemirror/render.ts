import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

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
  updateBauble: (bauble: BaubleUpdate) => void,
  updateCover: (cover: CoverUpdate) => void,
  updateStyling: (styling: StylingUpdate) => void
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
  return view;
}
