import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

import schema from "./schema";
import keymap from "./keymap";
import shortcuts from "./shortcuts";
import save from "./save";

export default function (workspace: any, place: HTMLElement): EditorView {
  console.log(place);
  console.log(workspace);
  const state = EditorState.create({
    schema: schema,
    plugins: [
      keymap,
      shortcuts,
      save((view) => {
        console.log("Saving...");
      }),
    ],
  });
  const view = new EditorView(place, {
    state,
  });
  return view;
}
