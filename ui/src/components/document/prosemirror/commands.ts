import {
  EditorState,
  Transaction,
  AllSelection,
  TextSelection,
} from "prosemirror-state";
import type { Command } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import type { NodeType, ContentMatch } from "prosemirror-model";
import schema from "./schema";
import { CoverPluginKey } from "./cover";
import type { Cover } from "./cover";

// Engram
export const setCover: (newCover: Cover) => Command = (newCover: Cover) => (state, dispatch) => {
  const tr = state.tr.setNodeMarkup(newCover.pos, null, {src: newCover.src, xpositioning: newCover.xpositioning, ypositioning: newCover.ypositioning });
  if(dispatch) {
    dispatch(tr);
    return true
  }
  return true;
}

export const setProperty: (pos: number, key: string, value: string) => Command = (pos:number, key: string, value: string) => (state, dispatch) => {
  const tr = state.tr.setNodeMarkup(pos, null, {key: key, value: value });
  if(dispatch) {
    dispatch(tr);
    return true
  }
  return true;
}

// Prosemirror

export const hardBreak: Command = function (state, dispatch, view) {
  if (dispatch) {
    const sel = state.selection;
    const tr = state.tr.insert(sel.to, schema.nodes["hard-break"].create());
    dispatch(tr);
    return true;
  }
  return false;
};

export const createNodeNear: (node: NodeType, pos?: number) => Command =
  (node, pos) => (state, dispatch?) => {
    const sel = state.selection,
      { $from, $to } = sel;

    if (!node) return false;
    if (dispatch) {
      const side = pos
        ? pos
        : (!$from.parentOffset && $to.index() < $to.parent.childCount
            ? $from
            : $to
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
export function defaultBlockAt(match: ContentMatch) {
  for (let i = 0; i < match.edgeCount; i++) {
    const { type } = match.edge(i);
    if (type.isTextblock && !type.hasRequiredAttrs()) return type;
  }
  return null;
}

export function handleImageDrop(event: DragEvent): Promise<any> {
  return new Promise((resolve ,reject) => {
    if (!event.dataTransfer) return;
    const files = event.dataTransfer.files;
    if (files.length == 0) {
      reject();
    } else {
      event.preventDefault();

      if (
        ["image/png", "image/jpg", "image/jpeg"].includes(
          Array.from(files)[0].type
        )
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(Array.from(files)[0]);
        reader.onload = (res) => {
          resolve(reader.result);
        };
      }
    }
  })

}
