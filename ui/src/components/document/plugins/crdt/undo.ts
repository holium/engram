import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { UndoManager, Item, ContentType, XmlElement } from "yjs";
import { SyncPluginKey } from "./sync";
import { getRelativeSelection } from "./helpers";

export const LocalUndoPluginKey = new PluginKey("undo");

export const undo = (state: EditorState) => {
  const undoManager = LocalUndoPluginKey.getState(state).undoManager;
  if (undoManager != null) {
    undoManager.undo();
    return true;
  }
  return false;
};

export const redo = (state: EditorState) => {
  const undoManager = LocalUndoPluginKey.getState(state).undoManager;
  if (undoManager != null) {
    undoManager.redo();
    return true;
  }
  return false;
};

export const localundo = (
  config = {
    protectedNodes: new Set(["paragraph"]),
    trackedOrigins: [],
    undoManager: null,
  }
) => {
  return new Plugin({
    key: LocalUndoPluginKey,
    state: {
      init: (_, state) => {
        const syncState = SyncPluginKey.getState(state);
        const _undoManager =
          config.undoManager ||
          new UndoManager(syncState.type, {
            trackedOrigins: new Set(
              [SyncPluginKey].concat(config.trackedOrigins)
            ),
            deleteFilter: (item) =>
              defaultDeleteFilter(item, config.protectedNodes),
            captureTransaction: (tr) => tr.meta.get("addToHistory") !== false,
          });
        return {
          undoManager: _undoManager,
          prevSel: null,
          hasUndoOps: _undoManager.undoStack.length > 0,
          hasRedoOps: _undoManager.redoStack.length > 0,
        };
      },
      apply: (tr, value, prevState, state) => {
        const binding = SyncPluginKey.getState(state).binding;
        const undoManager = value.undoManager;
        const hasUndoOps = undoManager.undoStack.length > 0;
        const hasRedoOps = undoManager.redoStack.length > 0;
        if (binding) {
          return {
            undoManager,
            prevSel: getRelativeSelection(binding, prevState),
            hasUndoOps,
            hasRedoOps,
          };
        } else {
          if (
            hasUndoOps !== value.hasUndoOps ||
            hasRedoOps !== value.hasRedoOps
          ) {
            return Object.assign({}, value, {
              hasUndoOps: undoManager.undoStack.length > 0,
              hasRedoOps: undoManager.redoStack > 0,
            });
          } else {
            return value;
          }
        }
      },
    },
    view: (view: EditorView) => {
      const syncState = SyncPluginKey.getState(view.state);
      const undoManager = LocalUndoPluginKey.getState(view.state).undoManager;
      undoManager.on("stack-item-added", ({ stackItem }: any) => {
        const binding = syncState.binding;
        if (binding) {
          stackItem.meta.set(
            binding,
            LocalUndoPluginKey.getState(view.state).prevSel
          );
        }
      });
      undoManager.on("stack-item-popped", ({ stackItem }: any) => {
        const binding = syncState.binding;
        if (binding) {
          binding.beforeTransactionSelection =
            stackItem.meta.get(binding) || binding.beforeTransactionSelection;
        }
      });
      return {
        destroy: () => {
          undoManager.destroy();
        },
      };
    },
  });
};

export const defaultDeleteFilter = (
  item: Item,
  protectedNodes: Set<string>
): boolean => {
  return (
    !(item instanceof Item) ||
    !(item.content instanceof ContentType) ||
    !(
      item.content.type instanceof Text ||
      (item.content.type instanceof XmlElement &&
        protectedNodes.has(item.content.type.nodeName))
    ) ||
    item.content.type._length === 0
  );
};
