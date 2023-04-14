import { keymap } from "prosemirror-keymap";
import { Selection } from "prosemirror-state";
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
  setBlockType,
  selectAll,
} from "prosemirror-commands";
import { undo, redo } from "y-prosemirror"
import { undoInputRule } from "prosemirror-inputrules";
import {
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";
//import { undo, redo } from "./crdt/undo";
import { hardBreak, stopTab } from "./commands";
import schema from "./schema";

export default keymap({
  // Basic ---------------------------------------------------------------------
  "Mod-z": undo,
  "Mod-y": redo,
  // Enter
  Enter: chainCommands(
    (state, dispatch) => {
      const node = state.doc.nodeAt(state.selection.$anchor.before());
      if(node && node.type.name == "description") {
        if(state.selection.from + 1 == state.selection.$anchor.before() + node.nodeSize) {
          console.log("skip forward");
          const sel = Selection.findFrom(state.doc.resolve(state.selection.$anchor.before() + node.nodeSize), 1);
          if(dispatch && sel) {
            const tr = state.tr.setSelection(sel);
            dispatch(tr);
          }
          return true;
        }
      }
      return false;
      
    },
    newlineInCode,
    splitListItem(schema.nodes["li"]),
    createParagraphNear,
    liftEmptyBlock,
    splitBlock,
  ),
  "Shift-Enter": chainCommands(exitCode, hardBreak),
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
  Tab: chainCommands(sinkListItem(schema.nodes["li"]), stopTab),
  "Shift-Tab": liftListItem(schema.nodes["li"]),

  // Undo / Redo
  //"Mod-z": undo,
  //"Mod-y": redo,

  // Nodes ---------------------------------------------------------------------
  "Mod-]": sinkListItem(schema.nodes["li"]),
  "Mod-[": liftListItem(schema.nodes["li"]),

  // Marks ---------------------------------------------------------------------
  "Mod-b": toggleMark(schema.marks["strong"]),
  "Mod-i": toggleMark(schema.marks["italic"]),
  "Mod-u": toggleMark(schema.marks["underline"]),
  "Mod-~": toggleMark(schema.marks["strike"]),
  "Mod-`": toggleMark(schema.marks["code"]),
});
