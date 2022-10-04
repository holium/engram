import { EditorView } from "prosemirror-view";
import {
  EditorState,
  Transaction,
  TextSelection,
  Selection,
} from "prosemirror-state";
import { Slice, Fragment } from "prosemirror-model";
import * as Y from "yjs";

import { SyncPluginKey, SyncState } from "./sync";

import {
  relativePositionToAbsolutePosition,
  absolutePositionToRelativePosition,
  createNodeFromYElement,
  createNodeIfNotExists,
  updateYFragment,
  createRelativePosition,
  getRelativeSelection,
  isVisible,
  getUserColor,
} from "./helpers";

export class ProsemirrorBinding {
  type: any;
  view: EditorView;
  mapping: Map<any, any>;
  doc: any;

  isDestroyed: boolean;

  beforeAllTransactions: () => void;
  afterAllTransactions: () => void;
  beforeTransactionSelection: any;

  _observeFunction: (
    events: Array<Y.YEvent<any>>,
    transaction: Y.Transaction
  ) => void;
  _domSelectionInView: boolean | null;

  constructor(fragment: Y.XmlFragment, view: EditorView) {
    this.type = fragment;
    this.view = view;

    this.isDestroyed = false;

    this.mapping = new Map();
    this.doc = fragment.doc;

    this._observeFunction = this._typeChanged.bind(this);

    this.beforeTransactionSelection = null;
    this.beforeAllTransactions = () => {
      if (this.beforeTransactionSelection === null) {
        this.beforeTransactionSelection = getRelativeSelection(
          this,
          view.state
        );
      }
    };

    this.afterAllTransactions = () => {
      this.beforeTransactionSelection = null;
    };

    this.doc.on("beforeAllTransactions", this.beforeAllTransactions);
    this.doc.on("afterAllTransactions", this.afterAllTransactions);

    fragment.observeDeep(this._observeFunction);

    this._domSelectionInView = null;
  }

  _isLocalCursorInView() {
    if (!this.view.hasFocus()) return false;
    if (this._domSelectionInView === null) {
      // Calculate the domSelectionInView and clear by next tick after all events are finished
      setTimeout(() => {
        this._domSelectionInView = null as any;
      }, 0);
      this._domSelectionInView = this._isDomSelectionInView();
    }
    return this._domSelectionInView;
  }

  _isDomSelectionInView() {
    const sel = (this.view.root as Document).getSelection() as any;
    const range = (this.view.root as Document).createRange() as any;

    range.setStart(sel.anchorNode, sel.anchorOffset);
    range.setEnd(sel.focusNode, sel.focusOffset);

    // edge case
    const rects = range.getClientRects();
    if (rects.length === 0) {
      if (range.startContainer && range.collapsed) {
        range.selectNodeContents(range.startContainer);
      }
    }

    const bounding = range.getBoundingClientRect();
    const documentElement = document.documentElement;

    return (
      bounding.bottom >= 0 &&
      bounding.right >= 0 &&
      bounding.left <=
        (window.innerWidth || documentElement.clientWidth || 0) &&
      bounding.top <= (window.innerHeight || documentElement.clientHeight || 0)
    );
  }

  renderSnapshot(snapshot: Y.Snapshot, prevSnapshot: Y.Snapshot) {
    if (!prevSnapshot) {
      prevSnapshot = Y.createSnapshot(Y.createDeleteSet(), new Map());
    }
    this.view.dispatch(
      this.view.state.tr
        .setMeta("addToHistory", false)
        .setMeta(SyncPluginKey, { snapshot, prevSnapshot })
    );
  }

  unrenderSnapshot() {
    this.mapping = new Map();
    const fragmentContent = this.type
      .toArray()
      .map((t: any) =>
        createNodeFromYElement(t, this.view.state.schema, this.mapping)
      )
      .filter((n: any) => n !== null);

    const tr = this.view.state.tr
      .setMeta("addToHistory", false)
      .replace(
        0,
        this.view.state.doc.content.size,
        new Slice(Fragment.fromArray(fragmentContent), 0, 0)
      );
    tr.setMeta(SyncPluginKey, { snapshot: null, prevSnapshot: null });
    this.view.dispatch(tr);
  }

  _forceRerender() {
    this.mapping = new Map();
    const fragmentContent = this.type
      .toArray()
      .map((t: any) =>
        createNodeFromYElement(t, this.view.state.schema, this.mapping)
      )
      .filter((n: any) => n !== null);

    const tr = this.view.state.tr
      .setMeta("addToHistory", false)
      .replace(
        0,
        this.view.state.doc.content.size,
        new Slice(Fragment.fromArray(fragmentContent), 0, 0)
      );
    this.view.dispatch(tr.setMeta(SyncPluginKey, { isChangeOrigin: true }));
  }

  _renderSnapshot(
    snapshot: Y.Snapshot,
    prevSnapshot: Y.Snapshot,
    syncState: SyncState
  ) {
    if (!snapshot) {
      snapshot = Y.snapshot(this.doc);
    }
    // clear mapping because we are going to rerender
    this.mapping = new Map();
    this.doc.transact((transaction: Y.Transaction) => {
      // before rendering, we are going to sanitize ops and split deleted ops
      // if they were deleted by seperate users.

      const pud = syncState.permanentUserData;
      if (pud) {
        pud.dss.forEach((ds: any) => {
          Y.iterateDeletedStructs(transaction, ds, (item: any) => {
            //
          });
        });
      }
      const computeYChange = (type: any, id: any) => {
        const user =
          type === "added"
            ? pud.getUserByClientId(id.client)
            : pud.getUserByDeletedId(id);
        return {
          user,
          type,
          color: getUserColor(syncState.colorMapping, syncState.colors, user),
        };
      };

      // Create document fragment and render
      const fragmentContent = Y.typeListToArraySnapshot(
        this.type,
        new Y.Snapshot(prevSnapshot.ds, snapshot.sv)
      )
        .map((t) => {
          if (
            !t._item.deleted ||
            isVisible(t._item, snapshot) ||
            isVisible(t._item, prevSnapshot)
          ) {
            return createNodeFromYElement(
              t,
              this.view.state.schema,
              new Map(),
              snapshot,
              prevSnapshot,
              computeYChange
            );
          } else {
            // No need to render elements that are not visible by either snapshot.
            // If a client adds and deletes content in the same snapshot the element is not visible by either snapshot.
            return null;
          }
        })
        .filter((n) => n !== null);

      const tr = this.view.state.tr
        .setMeta("addToHistory", false)
        .replace(
          0,
          this.view.state.doc.content.size,
          new Slice(Fragment.fromArray(fragmentContent), 0, 0)
        );
      this.view.dispatch(tr.setMeta(SyncPluginKey, { isChangeOrigin: true }));
    }, SyncPluginKey);
  }

  _typeChanged(events: Array<Y.YEvent<any>>, transaction: Y.Transaction) {
    const syncState = SyncPluginKey.getState(this.view.state);
    if (
      events.length === 0 ||
      syncState.snapshot != null ||
      syncState.prevSnapshot != null
    ) {
      // drop out if snapshot is active
      this.renderSnapshot(syncState.snapshot, syncState.prevSnapshot);
      return;
    }
    const delType = (_: any, type: any) => this.mapping.delete(type);
    Y.iterateDeletedStructs(
      transaction,
      transaction.deleteSet,
      (struct) =>
        struct.constructor === Y.Item &&
        this.mapping.delete((struct.content as any).type)
    );
    transaction.changed.forEach(delType);
    transaction.changedParentTypes.forEach(delType);
    const fragmentContent = this.type
      .toArray()
      .map((t: any) => {
        return createNodeIfNotExists(t, this.view.state.schema, this.mapping);
      })
      .filter((n: any) => n !== null);

    let tr = this.view.state.tr
      .setMeta("addToHistory", false)
      .replace(
        0,
        this.view.state.doc.content.size,
        new Slice(Fragment.fromArray(fragmentContent), 0, 0)
      );
    restoreRelativeSelection(tr, this.beforeTransactionSelection, this);
    tr = tr.setMeta(SyncPluginKey, { isChangeOrigin: true });
    if (
      this.beforeTransactionSelection !== null &&
      this._isLocalCursorInView()
    ) {
      tr.scrollIntoView();
    }
    this.view.dispatch(tr);
  }

  _prosemirrorChanged(doc: any) {
    this.doc.transact((tr: Y.Transaction) => {
      updateYFragment(this.doc, this.type, doc, this.mapping);
      this.beforeTransactionSelection = getRelativeSelection(
        this,
        this.view.state
      );
    }, SyncPluginKey);
  }

  destroy() {
    this.isDestroyed = true;
    this.type.unobserveDeep(this._observeFunction);
    this.doc.off("beforeAllTransactions", this.beforeAllTransactions);
    this.doc.off("afterAllTransactions", this.afterAllTransactions);
  }
}

const restoreRelativeSelection = (
  tr: Transaction,
  relativeSelection: Selection,
  binding: ProsemirrorBinding
) => {
  if (
    relativeSelection !== null &&
    relativeSelection.anchor !== null &&
    relativeSelection.head !== null
  ) {
    const anchor = relativePositionToAbsolutePosition(
      binding.doc,
      binding.type,
      relativeSelection.anchor,
      binding.mapping
    );
    const head = relativePositionToAbsolutePosition(
      binding.doc,
      binding.type,
      relativeSelection.head,
      binding.mapping
    );
    if (anchor !== null && head !== null) {
      tr = tr.setSelection(TextSelection.create(tr.doc, anchor, head));
    }
  }
};
