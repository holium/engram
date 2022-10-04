import { keymap } from "prosemirror-keymap";
import { Plugin, Command } from "prosemirror-state";
import {
  chainCommands,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
  exitCode,
  toggleMark,
  wrapIn,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
  joinForward,
  selectNodeForward,
  newlineInCode,
} from "prosemirror-commands";
import { undoInputRule } from "prosemirror-inputrules";
import {
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";
import { undo, redo } from "./crdt/undo";
import { hardBreak, stopTab } from "./commands";
import schema from "./schema";

export default keymap({
  // Basic ---------------------------------------------------------------------
  // Enter
  Enter: chainCommands(
    newlineInCode,
    splitListItem(schema.nodes["li"]),
    createParagraphNear,
    liftEmptyBlock,
    splitBlock
  ),
  "Shift-Enter": hardBreak,
  "Mod-Enter": exitCode,
  // Delete
  Backspace: chainCommands(
    undoInputRule,
    deleteSelection,
    joinBackward,
    selectNodeBackward
  ),
  Delete: chainCommands(deleteSelection, joinForward, selectNodeForward),

  //Tab
  Tab: stopTab,

  // Undo / Redo
  "Mod-z": undo,
  "Mod-y": redo,

  // Nodes ---------------------------------------------------------------------
  "Mod->": wrapIn(schema.nodes["blockblockquote"]),
  "Mod-]": sinkListItem(schema.nodes["li"]),
  "Mod-[": liftListItem(schema.nodes["li"]),

  // Marks ---------------------------------------------------------------------
  "Mod-b": toggleMark(schema.marks["strong"]),
  "Mod-i": toggleMark(schema.marks["italic"]),
  "Mod-u": toggleMark(schema.marks["underline"]),
  "Mod-~": toggleMark(schema.marks["strike"]),
  "Mod-`": toggleMark(schema.marks["code"]),
});
