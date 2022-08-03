import * as Y from "yjs";
import { EditorState, TextSelection } from "prosemirror-state";
import { Node } from "prosemirror-model";
import { SyncPluginKey, UserColor } from "./sync";
import { ProsemirrorBinding } from "./binding";

export function getStateVector(store: any) {
  const sm = new Map();
  store.clients.forEach((structs: any, client: any) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm;
}

export const absolutePositionToRelativePosition = (
  pos: number,
  type: any,
  mapping: any
): any => {
  if (pos === 0) {
    return Y.createRelativePositionFromTypeIndex(type, 0);
  }
  /**
   * @type {any}
   */
  let n =
    type._first === null
      ? null
      : /** @type {Y.ContentType} */ type._first.content.type;
  while (n !== null && type !== n) {
    if (n instanceof Y.XmlText) {
      if (n._length >= pos) {
        return Y.createRelativePositionFromTypeIndex(n, pos);
      } else {
        pos -= n._length;
      }
      if (n._item !== null && n._item.next !== null) {
        n = (n._item.next.content as any).type;
      } else {
        do {
          n = n._item === null ? null : n._item.parent;
          pos--;
        } while (
          n !== type &&
          n !== null &&
          n._item !== null &&
          n._item.next === null
        );
        if (n !== null && n !== type) {
          // @ts-gnore we know that n.next !== null because of above loop conditition
          n =
            n._item === null
              ? null
              : /** @type {Y.ContentType} */ /** @type Y.Item */ n._item.next
                  .content.type;
        }
      }
    } else {
      const pNodeSize = /** @type {any} */ (mapping.get(n) || { nodeSize: 0 })
        .nodeSize;
      if (n._first !== null && pos < pNodeSize) {
        n = /** @type {Y.ContentType} */ n._first.content.type;
        pos--;
      } else {
        if (pos === 1 && n._length === 0 && pNodeSize > 1) {
          // edge case, should end in this paragraph
          return new Y.RelativePosition(
            n._item === null ? null : n._item.id,
            n._item === null ? Y.findRootTypeKey(n) : null,
            null
          );
        }
        pos -= pNodeSize;
        if (n._item !== null && n._item.next !== null) {
          n = /** @type {Y.ContentType} */ n._item.next.content.type;
        } else {
          if (pos === 0) {
            // set to end of n.parent
            n = n._item === null ? n : n._item.parent;
            return new Y.RelativePosition(
              n._item === null ? null : n._item.id,
              n._item === null ? Y.findRootTypeKey(n) : null,
              null
            );
          }
          do {
            n = /** @type {Y.Item} */ n._item.parent;
            pos--;
          } while (n !== type && /** @type {Y.Item} */ n._item.next === null);
          // if n is null at this point, we have an unexpected case
          if (n !== type) {
            // We know that n._item.next is defined because of above loop condition
            n =
              /** @type {Y.ContentType} */ /** @type {Y.Item} */ /** @type {Y.Item} */ n
                ._item.next.content.type;
          }
        }
      }
    }
    if (n === null) {
      throw "unexpected case";
    }
    if (pos === 0 && n.constructor !== Y.XmlText && n !== type) {
      // TODO: set to <= 0
      return createRelativePosition(n._item.parent, n._item);
    }
  }
  return Y.createRelativePositionFromTypeIndex(type, type._length);
};

export const relativePositionToAbsolutePosition = (
  y: Y.Doc,
  documentType: Y.XmlFragment,
  relPos: any,
  mapping: any
): null | number => {
  const decodedPos = Y.createAbsolutePositionFromRelativePosition(relPos, y);
  if (
    decodedPos === null ||
    (decodedPos.type !== documentType &&
      !Y.isParentOf(documentType, decodedPos.type._item))
  ) {
    return null;
  }
  let type = decodedPos.type;
  let pos = 0;
  if (type.constructor === Y.XmlText) {
    pos = decodedPos.index;
  } else if (type._item === null || !type._item.deleted) {
    let n = type._first;
    let i = 0;
    while (i < type._length && i < decodedPos.index && n !== null) {
      if (!n.deleted) {
        const t = (n.content as any).type;
        i++;
        if (t instanceof Y.XmlText) {
          pos += t._length;
        } else {
          pos += /** @type {any} */ mapping.get(t).nodeSize;
        }
      }
      n = /** @type {Y.Item} */ n.right;
    }
    pos += 1; // increase because we go out of n
  }
  while (type !== documentType && type._item !== null) {
    const parent = type._item.parent;

    if ((parent as any)._item === null || !(parent as any)._item.deleted) {
      pos += 1; // the start tag
      let n = (parent as any)._first;
      // now iterate until we found type
      while (n !== null) {
        const contentType = /** @type {Y.ContentType} */ n.content.type;
        if (contentType === type) {
          break;
        }
        if (!n.deleted) {
          if (contentType instanceof Y.XmlText) {
            pos += contentType._length;
          } else {
            pos += /** @type {any} */ mapping.get(contentType).nodeSize;
          }
        }
        n = n.right;
      }
    }
    type = parent as any;
  }
  return pos - 1; // we don't count the most outer tag, because it is a fragment
};

export const restoreRelativeSelection = (
  tr: any,
  relSel: any,
  binding: ProsemirrorBinding
) => {
  if (relSel !== null && relSel.anchor !== null && relSel.head !== null) {
    const anchor = relativePositionToAbsolutePosition(
      binding.doc,
      binding.type,
      relSel.anchor,
      binding.mapping
    );
    const head = relativePositionToAbsolutePosition(
      binding.doc,
      binding.type,
      relSel.head,
      binding.mapping
    );
    if (anchor !== null && head !== null) {
      tr = tr.setSelection(TextSelection.create(tr.doc, anchor, head));
    }
  }
};

export const createNodeFromYElement = (
  el: any,
  schema: any,
  mapping: any,
  snapshot?: Y.Snapshot,
  prevSnapshot?: Y.Snapshot,
  computeYChange?: any
) => {
  const children: Array<any> = [];
  const createChildren = (type: any) => {
    if (type.constructor === Y.XmlElement) {
      const n = createNodeIfNotExists(
        type,
        schema,
        mapping,
        snapshot as Y.Snapshot,
        prevSnapshot as Y.Snapshot,
        computeYChange
      );
      if (n !== null) {
        children.push(n);
      }
    } else {
      const ns = createTextNodesFromYText(
        type,
        schema,
        mapping,
        snapshot as Y.Snapshot,
        prevSnapshot as Y.Snapshot,
        computeYChange
      );
      if (ns !== null) {
        ns.forEach((textchild) => {
          if (textchild !== null) {
            children.push(textchild);
          }
        });
      }
    }
  };
  if (snapshot === undefined || prevSnapshot === undefined) {
    el.toArray().forEach(createChildren);
  } else {
    Y.typeListToArraySnapshot(
      el,
      new Y.Snapshot(prevSnapshot.ds, snapshot.sv)
    ).forEach(createChildren);
  }
  try {
    const attrs = el.getAttributes(snapshot);
    if (snapshot !== undefined) {
      if (!isVisible(el._item, snapshot)) {
        attrs.ychange = computeYChange
          ? computeYChange("removed", /** @type {Y.Item} */ el._item.id)
          : { type: "removed" };
      } else if (!isVisible(el._item, prevSnapshot as Y.Snapshot)) {
        attrs.ychange = computeYChange
          ? computeYChange("added", /** @type {Y.Item} */ el._item.id)
          : { type: "added" };
      }
    }
    const node = schema.node(el.nodeName, attrs, children);
    mapping.set(el, node);
    return node;
  } catch (e) {
    // an error occured while creating the node. This is probably a result of a concurrent action.
    el.doc.transact((transaction: Y.Transaction) => {
      el._item.delete(transaction);
    }, SyncPluginKey);
    mapping.delete(el);
    return null;
  }
};

export const createTextNodesFromYText = (
  text: Y.XmlText,
  schema: any,
  mapping: any,
  snapshot: Y.Snapshot,
  prevSnapshot: Y.Snapshot,
  computeYChange: any
) => {
  const nodes = [];
  const deltas = text.toDelta(snapshot, prevSnapshot, computeYChange);
  try {
    for (let i = 0; i < deltas.length; i++) {
      const delta = deltas[i];
      const marks = [];
      for (const markName in delta.attributes) {
        marks.push(schema.mark(markName, delta.attributes[markName]));
      }
      nodes.push(schema.text(delta.insert, marks));
    }
  } catch (e) {
    // an error occured while creating the node. This is probably a result of a concurrent action.
    (text.doc as any).transact((transaction: Y.Transaction) => {
      (text._item as any).delete(transaction);
    }, SyncPluginKey);
    return null;
  }

  return nodes;
};

export const getRelativeSelection = (
  binding: ProsemirrorBinding,
  state: EditorState
) => ({
  anchor: absolutePositionToRelativePosition(
    state.selection.anchor,
    binding.type,
    binding.mapping
  ),
  head: absolutePositionToRelativePosition(
    state.selection.head,
    binding.type,
    binding.mapping
  ),
});

export const updateYFragment = (
  y: { transact: any },
  yDomFragment: Y.XmlFragment,
  pNode: any,
  mapping: any
) => {
  if (
    yDomFragment instanceof Y.XmlElement &&
    yDomFragment.nodeName !== pNode.type.name
  ) {
    throw new Error("node name mismatch!");
  }
  mapping.set(yDomFragment, pNode);
  // update attributes
  if (yDomFragment instanceof Y.XmlElement) {
    const yDomAttrs = yDomFragment.getAttributes();
    const pAttrs = pNode.attrs;
    for (const key in pAttrs) {
      if (pAttrs[key] !== null) {
        if (yDomAttrs[key] !== pAttrs[key] && key !== "ychange") {
          yDomFragment.setAttribute(key, pAttrs[key]);
        }
      } else {
        yDomFragment.removeAttribute(key);
      }
    }
    // remove all keys that are no longer in pAttrs
    for (const key in yDomAttrs) {
      if (pAttrs[key] === undefined) {
        yDomFragment.removeAttribute(key);
      }
    }
  }
  // update children
  const pChildren = normalizePNodeContent(pNode);
  const pChildCnt = pChildren.length;
  const yChildren = yDomFragment.toArray();
  const yChildCnt = yChildren.length;
  const minCnt = Math.min(pChildCnt, yChildCnt);
  let left = 0;
  let right = 0;
  // find number of matching elements from left
  for (; left < minCnt; left++) {
    const leftY = yChildren[left];
    const leftP = pChildren[left];
    if (!mappedIdentity(mapping.get(leftY), leftP)) {
      if (equalYTypePNode(leftY as any, leftP)) {
        // update mapping
        mapping.set(leftY, leftP);
      } else {
        break;
      }
    }
  }
  // find number of matching elements from right
  for (; right + left + 1 < minCnt; right++) {
    const rightY = yChildren[yChildCnt - right - 1];
    const rightP = pChildren[pChildCnt - right - 1];
    if (!mappedIdentity(mapping.get(rightY), rightP)) {
      if (equalYTypePNode(rightY as any, rightP)) {
        // update mapping
        mapping.set(rightY, rightP);
      } else {
        break;
      }
    }
  }
  y.transact(() => {
    // try to compare and update
    while (yChildCnt - left - right > 0 && pChildCnt - left - right > 0) {
      const leftY = yChildren[left];
      const leftP = pChildren[left];
      const rightY = yChildren[yChildCnt - right - 1];
      const rightP = pChildren[pChildCnt - right - 1];
      if (leftY instanceof Y.XmlText && leftP instanceof Array) {
        if (!equalYTextPText(leftY, leftP)) {
          updateYText(leftY, leftP, mapping);
        }
        left += 1;
      } else {
        let updateLeft =
          leftY instanceof Y.XmlElement && matchNodeName(leftY, leftP);
        let updateRight =
          rightY instanceof Y.XmlElement && matchNodeName(rightY, rightP);
        if (updateLeft && updateRight) {
          // decide which which element to update
          const equalityLeft = computeChildEqualityFactor(
            leftY as any,
            leftP,
            mapping
          );
          const equalityRight = computeChildEqualityFactor(
            rightY as any,
            rightP,
            mapping
          );
          if (
            equalityLeft.foundMappedChild &&
            !equalityRight.foundMappedChild
          ) {
            updateRight = false;
          } else if (
            !equalityLeft.foundMappedChild &&
            equalityRight.foundMappedChild
          ) {
            updateLeft = false;
          } else if (
            equalityLeft.equalityFactor < equalityRight.equalityFactor
          ) {
            updateLeft = false;
          } else {
            updateRight = false;
          }
        }
        if (updateLeft) {
          updateYFragment(y, leftY as Y.XmlFragment, leftP, mapping);
          left += 1;
        } else if (updateRight) {
          updateYFragment(y, rightY as Y.XmlFragment, rightP, mapping);
          right += 1;
        } else {
          yDomFragment.delete(left, 1);
          yDomFragment.insert(left, [
            createTypeFromTextOrElementNode(leftP, mapping),
          ]);
          left += 1;
        }
      }
    }
    const yDelLen = yChildCnt - left - right;
    if (
      yChildCnt === 1 &&
      pChildCnt === 0 &&
      yChildren[0] instanceof Y.XmlText
    ) {
      // Edge case handling https://github.com/yjs/y-prosemirror/issues/108
      // Only delete the content of the Y.Text to retain remote changes on the same Y.Text object
      yChildren[0].delete(0, yChildren[0].length);
    } else if (yDelLen > 0) {
      yDomFragment.delete(left, yDelLen);
    }
    if (left + right < pChildCnt) {
      const ins = [];
      for (let i = left; i < pChildCnt - right; i++) {
        ins.push(createTypeFromTextOrElementNode(pChildren[i], mapping));
      }
      yDomFragment.insert(left, ins);
    }
  }, SyncPluginKey);
};

export const createTypeFromTextOrElementNode = (
  node: Node | Array<Node>,
  mapping: any
): Y.XmlElement | Y.XmlText =>
  node instanceof Array
    ? createTypeFromTextNodes(node, mapping)
    : createTypeFromElementNode(node, mapping);

export const createTypeFromTextNodes = (
  nodes: Array<any>,
  mapping: any
): Y.XmlText => {
  const type = new Y.XmlText();
  const delta = nodes.map((node) => ({
    insert: node.text,
    attributes: marksToAttributes(node.marks),
  }));
  type.applyDelta(delta);
  mapping.set(type, nodes);
  return type;
};

/**
 * @private
 * @param {any} node prosemirror node
 * @param {ProsemirrorMapping} mapping
 * @return {Y.XmlElement}
 */
export const createTypeFromElementNode = (
  node: any,
  mapping: any
): Y.XmlElement => {
  const type = new Y.XmlElement(node.type.name);
  for (const key in node.attrs) {
    const val = node.attrs[key];
    if (val !== null && key !== "ychange") {
      type.setAttribute(key, val);
    }
  }
  type.insert(
    0,
    normalizePNodeContent(node).map((n) =>
      createTypeFromTextOrElementNode(n, mapping)
    )
  );
  mapping.set(type, node);
  return type;
};

export const computeChildEqualityFactor = (
  ytype: Y.XmlFragment,
  pnode: Node,
  mapping: any
) => {
  const yChildren = ytype.toArray();
  const pChildren = normalizePNodeContent(pnode);
  const pChildCnt = pChildren.length;
  const yChildCnt = yChildren.length;
  const minCnt = Math.min(yChildCnt, pChildCnt);
  let left = 0;
  let right = 0;
  let foundMappedChild = false;
  for (; left < minCnt; left++) {
    const leftY = yChildren[left];
    const leftP = pChildren[left];
    if (mappedIdentity(mapping.get(leftY), leftP)) {
      foundMappedChild = true; // definite (good) match!
    } else if (!equalYTypePNode(leftY as any, leftP)) {
      break;
    }
  }
  for (; left + right < minCnt; right++) {
    const rightY = yChildren[yChildCnt - right - 1];
    const rightP = pChildren[pChildCnt - right - 1];
    if (mappedIdentity(mapping.get(rightY), rightP)) {
      foundMappedChild = true;
    } else if (!equalYTypePNode(rightY as any, rightP)) {
      break;
    }
  }
  return {
    equalityFactor: left + right,
    foundMappedChild,
  };
};

export const matchNodeName = (yElement: Y.XmlElement, pNode: any) =>
  !(pNode instanceof Array) && yElement.nodeName === pNode.type.name;

export const updateYText = (ytext: Y.XmlText, ptexts: any, mapping: any) => {
  mapping.set(ytext, ptexts);
  const { nAttrs, str } = ytextTrans(ytext);
  const content = ptexts.map((p: any) => ({
    insert: /** @type {any} */ p.text,
    attributes: Object.assign({}, nAttrs, marksToAttributes(p.marks)),
  }));
  const { insert, remove, index } = simpleDiff(
    str,
    content.map((c: any) => c.insert).join("")
  );
  ytext.delete(index, remove);
  ytext.insert(index, insert);
  ytext.applyDelta(
    content.map((c: any) => ({
      retain: c.insert.length,
      attributes: c.attributes,
    }))
  );
};

export const simpleDiff = (a: any, b: any) => {
  let left = 0; // number of same characters counting from left
  let right = 0; // number of same characters counting from right
  while (left < a.length && left < b.length && a[left] === b[left]) {
    left++;
  }
  while (
    right + left < a.length &&
    right + left < b.length &&
    a[a.length - right - 1] === b[b.length - right - 1]
  ) {
    right++;
  }
  return {
    index: left,
    remove: a.length - left - right,
    insert: b.slice(left, b.length - right),
  };
};

export const ytextTrans = (ytext: Y.XmlText) => {
  let str = "";
  /**
   * @type {Y.Item|null}
   */
  let n = ytext._start;
  const nAttrs = {};
  while (n !== null) {
    if (!n.deleted) {
      if (n.countable && n.content instanceof Y.ContentString) {
        str += n.content.str;
      } else if (n.content instanceof Y.ContentFormat) {
        (nAttrs as any)[n.content.key] = null;
      }
    }
    n = n.right;
  }
  return {
    str,
    nAttrs,
  };
};

export const marksToAttributes = (marks: Array<any>) => {
  const pattrs = {};
  marks.forEach((mark) => {
    if (mark.type.name !== "ychange") {
      (pattrs as any)[mark.type.name] = mark.attrs;
    }
  });
  return pattrs;
};

export const equalYTypePNode = (
  ytype: Y.XmlFragment | Y.XmlElement | Y.XmlText,
  pnode: any | Array<any>
): any => {
  if (
    ytype instanceof Y.XmlElement &&
    !(pnode instanceof Array) &&
    matchNodeName(ytype, pnode)
  ) {
    const normalizedContent = normalizePNodeContent(pnode);
    return (
      ytype._length === normalizedContent.length &&
      equalAttrs(ytype.getAttributes(), pnode.attrs) &&
      ytype
        .toArray()
        .every((ychild, i) =>
          equalYTypePNode(ychild as any, normalizedContent[i])
        )
    );
  }
  return (
    ytype instanceof Y.XmlText &&
    pnode instanceof Array &&
    equalYTextPText(ytype, pnode)
  );
};

export const normalizePNodeContent = (pnode: Node) => {
  const c = (pnode.content as any).content;
  const res = [];
  for (let i = 0; i < c.length; i++) {
    const n = c[i];
    if (n.isText) {
      const textNodes = [];
      for (let tnode = c[i]; i < c.length && tnode.isText; tnode = c[++i]) {
        textNodes.push(tnode);
      }
      i--;
      res.push(textNodes);
    } else {
      res.push(n);
    }
  }
  return res;
};

export const equalYTextPText = (ytext: Y.XmlText, ptexts: Array<any>) => {
  const delta = ytext.toDelta();
  return (
    delta.length === ptexts.length &&
    delta.every(
      (d: any, i: any) =>
        d.insert === ptexts[i].text &&
        Object.keys(d.attributes || {}).length === ptexts[i].marks.length &&
        ptexts[i].marks.every((mark: any) =>
          equalAttrs(d.attributes[mark.type.name] || {}, mark.attrs)
        )
    )
  );
};

export const isObject = (val: any) => typeof val === "object" && val !== null;

export const equalAttrs = (pattrs: any, yattrs: any) => {
  const keys = Object.keys(pattrs).filter((key) => pattrs[key] !== null);
  let eq =
    keys.length ===
    Object.keys(yattrs).filter((key) => yattrs[key] !== null).length;
  for (let i = 0; i < keys.length && eq; i++) {
    const key = keys[i];
    const l = pattrs[key];
    const r = yattrs[key];
    eq =
      key === "ychange" ||
      l === r ||
      (isObject(l) && isObject(r) && equalAttrs(l, r));
  }
  return eq;
};

export const mappedIdentity = (
  mapped: Node | Array<Node>,
  pcontent: Node | Array<Node>
): boolean => {
  return (
    mapped === pcontent ||
    (mapped instanceof Array &&
      pcontent instanceof Array &&
      mapped.length === pcontent.length &&
      mapped.every((a, i) => pcontent[i] === a))
  );
};

export const isVisible = (item: Y.Item, snapshot: Y.Snapshot): boolean => {
  return snapshot === undefined
    ? !item.deleted
    : snapshot.sv.has(item.id.client) &&
        (snapshot.sv.get(item.id.client) as number) > item.id.clock &&
        !Y.isDeleted(snapshot.ds, item.id);
};

export const createRelativePosition = (type: any, item: Y.Item) => {
  let typeid = null;
  let tname = null;
  if (type._item === null) {
    tname = Y.findRootTypeKey(type);
  } else {
    typeid = Y.createID(type._item.id.client, type._item.id.clock);
  }
  return new Y.RelativePosition(typeid, tname, item.id);
};

export const createNodeIfNotExists = (
  el: any,
  schema: any,
  mapping: any,
  snapshot?: Y.Snapshot,
  prevSnapshot?: Y.Snapshot,
  computeYChange?: any
) => {
  const node = mapping.get(el);
  if (node === undefined) {
    if (el instanceof Y.XmlElement) {
      return createNodeFromYElement(
        el,
        schema,
        mapping,
        snapshot,
        prevSnapshot,
        computeYChange
      );
    } else {
      throw "not implemented";
    }
  }
  return node;
};

export const getUserColor = (
  colorMapping: Map<number, UserColor>,
  colors: Array<UserColor>,
  user: number
) => {
  // @todo do not hit the same color twice if possible
  if (!colorMapping.has(user)) {
    if (colorMapping.size < colors.length) {
      const usedColors = new Set();
      colorMapping.forEach((color) => usedColors.add(color));
      colors = colors.filter((color) => !usedColors.has(color));
    }
    colorMapping.set(user, colors[Math.floor(Math.random() * colors.length)]);
  }
  return colorMapping.get(user);
};
