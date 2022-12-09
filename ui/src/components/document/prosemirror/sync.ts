import { Plugin, PluginKey } from "prosemirror-state";
import * as Y from "yjs";

import { ProsemirrorBinding } from "./binding";
import { LocalUndoPluginKey } from "./undo";

export const SyncPluginKey = new PluginKey("sync");

export interface SyncState {
  type: any;
  doc: any;
  binding: ProsemirrorBinding | null;
  snapshot: Y.Snapshot | null;
  prevSnapshot: Y.Snapshot | null;
  isChangeOrigin: boolean;
  addToHistory: boolean;

  colors: Array<UserColor>;
  colorMapping: Map<number, UserColor>;
  permanentUserData: any;
}

export interface UserColor {
  light: string;
  dark: string;
}

export const sync = (
  fragment: Y.XmlFragment,
  {
    colors = [{ light: "#26262620", dark: "#262626" }],
    colorMapping = new Map(),
    permanentUserData = null,
    onFirstRender = () => {
      //
    },
  }
): Plugin => {
  let changedInitialContent = false;
  let rerenderTimeout: any;
  return new Plugin({
    key: SyncPluginKey,
    state: {
      init: () => {
        return {
          type: fragment,
          doc: fragment.doc,
          binding: null,
          snapshot: null,
          prevSnapshot: null,
          isChangeOrigin: false,
          addToHistory: true,
          colors,
          colorMapping,
          permanentUserData,
        } as SyncState;
      },
      apply: (tr, state) => {
        const change = tr.getMeta(SyncPluginKey);
        if (change !== undefined) {
          state = Object.assign({}, state);
          for (const key in change) {
            (state as any)[key] = change[key];
          }
        }

        state.addToHistory = tr.getMeta("addToHistory") !== false;

        state.isChangeOrigin = change !== undefined && !!change.isChangeOrigin;

        if (state.binding !== null) {
          if (
            change !== undefined &&
            (change.snapshot != null || change.prevSnapshot != null)
          ) {
            setTimeout(() => {
              if (state.binding == null || state.binding.isDestroyed) {
                return;
              }
              if (change.restore == null) {
                state.binding._renderSnapshot(
                  change.snapshot,
                  change.prevSnapshot,
                  state
                );
              } else {
                state.binding._renderSnapshot(
                  change.snapshot,
                  change.snapshot,
                  state
                );

                delete (state as any).restore;
                state.snapshot = null;
                state.prevSnapshot = null;
                state.binding._prosemirrorChanged(state.binding.view.state.doc);
              }
            }, 0);
          }
        }
        return state;
      },
    },
    view: (view) => {
      const binding = new ProsemirrorBinding(fragment, view);
      if (rerenderTimeout != null) {
        rerenderTimeout.destroy();
      }

      rerenderTimeout = setTimeout(() => {
        binding._forceRerender();
        view.dispatch(view.state.tr.setMeta(SyncPluginKey, { binding }));
        //onFirstRender();
      }, 0);

      return {
        update: () => {
          const syncState = SyncPluginKey.getState(view.state);
          if (syncState.snapshot == null && syncState.prevSnapshot == null) {
            if (
              changedInitialContent ||
              view.state.doc.content.findDiffStart(
                (view.state.doc.type.createAndFill() as any).content
              ) != null
            ) {
              changedInitialContent = true;
              if (
                syncState.addToHistory === false &&
                !syncState.isChangeOrigin
              ) {
                const undoState = LocalUndoPluginKey.getState(view.state);

                const um = undoState && undoState.undoManager;
                if (um) {
                  um.stopCapturing();
                }
              }
              syncState.doc.transact((tr: Y.Transaction) => {
                tr.meta.set("addToHistory", syncState.addToHistory);
                binding._prosemirrorChanged(view.state.doc);
              }, SyncPluginKey);
            }
          }
        },
        destroy: () => {
          clearTimeout(rerenderTimeout);
          binding.destroy();
        },
      };
    },
  });
};
