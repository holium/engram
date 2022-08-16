import { keymap } from "prosemirror-keymap";
import { Command } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import schema from "./schema";
import {
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
  exitCode,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
  joinForward,
  selectNodeForward,
  selectAll,
  selectTextblockStart,
  selectTextblockEnd,
  toggleMark,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
  wrapIn,
  setBlockType,
} from "prosemirror-commands";
import { undoInputRule } from "prosemirror-inputrules";
import { wrapInList, splitListItem, liftListItem, sinkListItem } from "./lists";
import { undo, redo } from "y-prosemirror";

const backspace = chainCommands(
  deleteSelection,
  joinBackward,
  selectNodeBackward
);
const del = chainCommands(deleteSelection, joinForward, selectNodeForward);

export const baseKeymap = keymap({
  Enter: chainCommands(
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlock
  ),
  "Mod-Enter": exitCode,
  Backspace: backspace,
  "Mod-Backspace": backspace,
  "Shift-Backspace": backspace,
  Delete: del,
  "Mod-Delete": del,
  "Mod-a": selectAll,
});

export function buildKeymap(
  schema: Schema,
  mapKeys?: { [key: string]: false | string }
) {
  let keys: { [key: string]: Command } = {},
    type;
  function bind(key: string, cmd: Command) {
    if (mapKeys) {
      let mapped = mapKeys[key];
      if (mapped === false) return;
      if (mapped) key = mapped;
    }
    keys[key] = cmd;
  }

  bind("Mod-z", undo);
  bind("Shift-Mod-z", redo);
  bind("Backspace", undoInputRule);
  bind("Mod-y", redo);

  bind("Alt-ArrowUp", joinUp);
  bind("Alt-ArrowDown", joinDown);
  bind("Mod-BracketLeft", lift);
  bind("Escape", selectParentNode);

  if ((type = schema.marks["strong"])) {
    bind("Mod-b", toggleMark(type));
    bind("Mod-B", toggleMark(type));
  }
  if ((type = schema.marks["em"])) {
    bind("Mod-i", toggleMark(type));
    bind("Mod-I", toggleMark(type));
  }
  if ((type = schema.marks["underline"])) {
    bind("Mod-u", toggleMark(type));
    bind("Mod-u", toggleMark(type));
  }
  if ((type = schema.marks.code)) bind("Mod-`", toggleMark(type));

  if ((type = schema.nodes["unordered-list"]))
    bind("Shift-Ctrl-8", wrapInList(type));
  if ((type = schema.nodes["ordered-list"]))
    bind("Shift-Ctrl-9", wrapInList(type));
  if ((type = schema.nodes["blockquote"])) bind("Ctrl->", wrapIn(type));
  if ((type = schema.nodes["hard-break"])) {
    let br = type,
      cmd = chainCommands(exitCode, (state, dispatch) => {
        if (dispatch)
          dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
        return true;
      });
    bind("Mod-Enter", cmd);
    bind("Shift-Enter", cmd);
  }
  if (schema.nodes["listitem"] && schema.nodes["checklistitem"]) {
    bind(
      "Enter",
      chainCommands(
        splitListItem(schema.nodes["listitem"]),
        splitListItem(schema.nodes["checklistitem"])
      )
    );
    bind(
      "Mod-[",
      chainCommands(
        liftListItem(schema.nodes["listitem"]),
        liftListItem(schema.nodes["checklistitem"])
      )
    );
    bind(
      "Mod-]",
      chainCommands(
        sinkListItem(schema.nodes["listitem"]),
        sinkListItem(schema.nodes["checklistitem"])
      )
    );
  } else {
    if ((type = schema.nodes["checklistitem"])) {
      bind("Enter", splitListItem(type));
      bind("Mod-[", liftListItem(type));
      bind("Mod-]", sinkListItem(type));
    }
    if ((type = schema.nodes["listitem"])) {
      console.log("list itme");
      bind("Enter", splitListItem(type));
      bind("Mod-[", liftListItem(type));
      bind("Mod-]", sinkListItem(type));
    }
  }

  if ((type = schema.nodes["code-block"]))
    bind("Shift-Ctrl-\\", setBlockType(type));
  if ((type = schema.nodes["horizontal-rule"])) {
    let hr = type;
    bind("Mod-_", (state, dispatch) => {
      if (dispatch)
        dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
      return true;
    });
  }

  return keymap(keys);
}
