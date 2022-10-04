import {
  EditorState,
  Transaction,
  AllSelection,
  TextSelection,
} from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { NodeType, ContentMatch } from "prosemirror-model";
import { Command } from "prosemirror-commands";
import schema from "./schema";

export const hardBreak: Command = function (state, dispatch, view) {
  if (dispatch) {
    const sel = state.selection;
    const tr = state.tr.insert(sel.to, schema.nodes["hard-break"].create());
    dispatch(tr);
    return true;
  }
  return false;
};

export const createNodeNear: (node: NodeType) => Command =
  (node) => (state, dispatch?) => {
    const sel = state.selection,
      { $from, $to } = sel;
    /*
    if (
      sel instanceof AllSelection ||
      $from.parent.inlineContent ||
      $to.parent.inlineContent
    ) {
      console.log("something about inline content");
      return false;
    }
    */

    if (!node) return false;
    console.log("here");
    if (dispatch) {
      const side = (
        !$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to
      ).pos;
      const tr = state.tr.insert(side, node.createAndFill()!);
      tr.setSelection(TextSelection.create(tr.doc, side + 1));
      dispatch(tr.scrollIntoView());
    }
    return true;
  };

export const stopTab: Command = function (state, dispatch, view) {
  /*
  if (dispatch) {
    return true;
  }
  return false;
  */
  return true;
};

// helpers
function defaultBlockAt(match: ContentMatch) {
  for (let i = 0; i < match.edgeCount; i++) {
    const { type } = match.edge(i);
    if (type.isTextblock && !type.hasRequiredAttrs()) return type;
  }
  return null;
}
