import type { EditorState } from "prosemirror-state";
import type { MarkType } from "prosemirror-model";
import {
  InputRule,
  wrappingInputRule,
  inputRules,
  textblockTypeInputRule,
} from "prosemirror-inputrules";
import schema from "./schema";

// Nodes -----------------------------------------------------------------------
const engramRule = textblockTypeInputRule(
  new RegExp("@\/~[\w-]+\/\d+\s"),
  schema.nodes["engramlink"],
  (match) => {
    console.log("matched? ", match);
    return { href: `/~${match}/`}
  }
)

const headingRule = textblockTypeInputRule(
  new RegExp("^(#{1,6})\\s$"),
  schema.nodes["heading"],
  (match: any) => ({ level: match[1].length })
);

const blockquoteRule = textblockTypeInputRule(
  /^\s*>\s$/,
  schema.nodes["blockquote"]
);

const horizontalRuleRule = new InputRule(
  /^(---|___)\s$/,
  (state, match, start, end) => {
    return state.tr.replaceWith(
      start - 1,
      end,
      schema.nodes["horizontal-rule"].create()
    );
  }
);

const codeBlockRule = textblockTypeInputRule(
  /^```\s$/,
  schema.nodes["code-block"]
);

const unorderedListRule = wrappingInputRule(
  /^\s*([-+*])\s$/,
  schema.nodes["unordered-list"]
);

const orderedListRule = wrappingInputRule(
  /^(\d+)\.\s$/,
  schema.nodes["ordered-list"],
  (match) => ({ order: +match[1] }),
  (match, node) => node.childCount + node.attrs.order == +match[1]
);

// Marks -----------------------------------------------------------------------

const boldRule = markInputRule(
  /((?:\*\*)(?<content>(?:[^*]+))(?:\*\*))$/,
  schema.marks["strong"],
  null
);

const italicRule = markInputRule(
  /((?:\*)(?<content>(?:[^*]+))(?:\*))$/,
  schema.marks["italic"],
  null
);

const underlineRule = markInputRule(
  /((?:_)((?<content>[^~]+))(?:_))$/,
  schema.marks["underline"],
  null
);

const strikeRule = markInputRule(
  /((?:~~)((?<content>[^~]+))(?:~~))$/,
  schema.marks["strike"],
  null
);

const codeRule = markInputRule(
  /^`(?<content>[^`]+)`$/,
  schema.marks["code"],
  null
);

export default inputRules({
  rules: [
    // Nodes
    headingRule,
    blockquoteRule,
    horizontalRuleRule,
    codeBlockRule,
    orderedListRule,
    unorderedListRule,
    engramRule,
    // Marks
    boldRule,
    italicRule,
    underlineRule,
    strikeRule,
    codeRule,
  ],
});

// helpers
export function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  getAttrs: any
): InputRule {
  return new InputRule(regexp, (state: EditorState, match: any, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const tr = state.tr;
    if (match && match.groups["content"]) {
      const textStart = start + match[0].indexOf(match.groups["content"]);
      const textEnd = textStart + match.groups["content"].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      end = start + match.groups["content"].length;
    }
    return tr.addMark(start, end, markType.create(attrs));
  });
}

export function extendMark(
  state: EditorState,
  from: number,
  to: number,
  mark: MarkType
): null | { from: number; to: number } {
  if (state.doc.rangeHasMark(from, to, mark)) {
    let start = from;
    let end = to;
    // start
    if (state.doc.rangeHasMark(start - 1, start, mark)) {
      while (state.doc.rangeHasMark(start - 1, start, mark)) {
        start--;
      }
    } else {
      while (!state.doc.rangeHasMark(start, start + 1, mark)) {
        start++;
      }
    }
    //end
    if (state.doc.rangeHasMark(end, end + 1, mark)) {
      while (state.doc.rangeHasMark(end, end + 1, mark)) {
        end++;
      }
    } else {
      while (!state.doc.rangeHasMark(end - 1, end, mark)) {
        end--;
      }
    }

    return { from: start, to: end };
  }
  return null;
}
