import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

import schema from "./schema";

export default function (workspace: any, place: HTMLElement): EditorView {
  console.log(place);
  console.log(workspace);
  const state = EditorState.create({
    schema: schema,
    plugins: [],
  });
  const view = new EditorView(place, {
    state,
  });
  return view;
}
