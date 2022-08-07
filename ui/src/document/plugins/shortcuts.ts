import {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  NodeSelection,
} from "prosemirror-state";
import {
  InputRule,
  wrappingInputRule,
  inputRules,
} from "prosemirror-inputrules";
import { Schema, NodeType, Attrs } from "prosemirror-model";
import schema from "../build/schema.ts";
import { getNodeType } from "../build/schema.ts";

export const MarkdownPluginKey = new PluginKey("markdown-commands");

const headingRule = new InputRule(
  new RegExp("^(#{1,3})\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["heading"].create({ level: match[0].length - 1 })
    );
  }
);

const blockquoteRule = new InputRule(
  new RegExp("^>\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["blockquote"].create({}, schema.nodes["paragraph"].create())
    );
  }
);

const asideRule = new InputRule(
  new RegExp("^>>\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(start - 1, end, schema.nodes["aside"].create());
  }
);

const horizontalRuleRule = new InputRule(
  new RegExp("^(---|___)\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["horizontal-rule"].create()
    );
  }
);

const OrderedListRule = new InputRule(
  new RegExp("^1.\\s$"),
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["ordered-list"].create(
        {},
        schema.nodes["listitem"].create({}, schema.nodes["paragraph"].create())
      )
    );
  }
);

const UnorderedListRule = new InputRule(
  /^(\-|\+)\s$/,
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["unordered-list"].create(
        {},
        schema.nodes["listitem"].create({}, schema.nodes["paragraph"].create())
      )
    );
  }
);

const CheckListRule = new InputRule(
  /^(\[\]|\[\s\])\s$/,
  (state, match, start, end) => {
    console.log("does it run");
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["check-list"].create(
        {},
        schema.nodes["checklistitem"].create(
          {},
          schema.nodes["paragraph"].create()
        )
      )
    );
  }
);

const italicRule = wrappingInputRule(
  /(?:^|s)((?:\*)((?:[^*]+))(?:\*))$/,
  schema.marks["em"]
);

const boldRule = wrappingInputRule(
  /(?:^|s)((?:\*\*)((?:[^*]+))(?:\*\*))$/,
  schema.marks["strong"]
);

export default (schema: Schema) => {
  const rules = [];
  if (typeof schema.nodes["heading"] != undefined) rules.push(headingRule);
  if (typeof schema.nodes["blockquote"] != undefined)
    rules.push(blockquoteRule);
  if (typeof schema.nodes["aside"] != undefined) rules.push(asideRule);
  if (typeof schema.nodes["horizontal-rule"] != undefined)
    rules.push(horizontalRuleRule);
  if (typeof schema.nodes["ordered-list"] != undefined)
    rules.push(OrderedListRule);
  if (typeof schema.nodes["unordered-list"] != undefined)
    rules.push(UnorderedListRule);
  if (typeof schema.nodes["check-list"] != undefined) rules.push(CheckListRule);
  if (typeof schema.marks["em"] != undefined) rules.push(italicRule);
  if (typeof schema.marks["strong"] != undefined) rules.push(boldRule);
  return inputRules({ rules: rules });
};

/* Helpers */
export function setNodeType(
  state: EditorState,
  nodeType: NodeType,
  attrs: Attrs | null = null
): Transaction {
  let { from, to } = state.selection;
  let applicable = false;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (applicable) return false;
    if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
    if (node.type == nodeType) {
      applicable = true;
    } else {
      let $pos = state.doc.resolve(pos),
        index = $pos.index();
      applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
    }
  });
  if (!applicable) return null;
  return state.tr.setBlockType(from, to, nodeType, attrs);
}