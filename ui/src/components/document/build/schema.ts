import {
  Schema,
  NodeSpec,
  NodeType,
  MarkSpec,
  DOMOutputSpec,
} from "prosemirror-model";
import { ConfigSpec, ConfigTermSpec } from "../plugins/config/plugin";

const schema = new Schema({
  nodes: {
    // Document
    doc: {
      content: "header block+",
      //content: "block+"
    } as NodeSpec,

    header: {
      content: "config title description{0,1}",
      group: "header",
      parseDOM: [{ tag: "header" }],
      toDOM() {
        return ["header", 0] as DOMOutputSpec;
      },
      selectable: false,
    } as NodeSpec,

    config: (ConfigSpec as any) as NodeSpec,
    typefrequency: ConfigTermSpec("16"),
    typeratio: ConfigTermSpec("2"),
    headingtypeface: ConfigTermSpec("sans"),
    bodytypeface: ConfigTermSpec("sans"),
    documentwidth: ConfigTermSpec("60"),

    // Title
    title: {
      content: "text*",
      group: "title",
      parseDOM: [{ tag: `h1[data-type="header"]` }],
      toDOM() {
        return ["h1", { "data-type": "header" }, 0] as DOMOutputSpec;
      },
      selectable: true,
    },

    // Description
    description: {
      content: "inline*",
      group: "description",
      parseDOM: [{ tag: `p[data-type="header"]` }],
      toDOM() {
        return ["p", { "data-type": "header" }, 0] as DOMOutputSpec;
      },
      selectable: true,
    },

    /* Block ================================================================ */
    // Paragraph
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0] as DOMOutputSpec;
      },
    } as NodeSpec,

    // Heading
    heading: {
      content: "inline*",
      group: "block",
      attrs: { level: { default: 1 } },
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM(node) {
        return [`h${node.attrs.level}`, 0] as DOMOutputSpec;
      },
      defining: true,
    } as NodeSpec,

    // Blockquote
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      },
      defining: true,
    } as NodeSpec,

    // Blockquote
    "code-block": {
      content: "text*",
      group: "block",
      code: true,
      defining: true,
      parseDOM: [{ tag: "pre" }],
      toDOM() {
        return ["pre", 0];
      },
    } as NodeSpec,

    // Caption
    caption: {
      content: "text*",
      parseDOM: [{ tag: "figcaption" }],
      toDOM() {
        return ["figcaption", 0];
      },
      atom: false,
    },

    /// A horizontal rule (`<hr>`).
    "horizontal-rule": {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["hr"];
      },
    } as NodeSpec,

    // List Item
    listitem: {
      parseDOM: [{ tag: "li" }],
      toDOM() {
        return ["li", 0];
      },
      defining: true,
      content: "paragraph block*",
    } as NodeSpec,

    // Ordered List
    "ordered-list": {
      group: "block",
      content: "listitem+",
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: "ol",
          getAttrs(dom: HTMLElement) {
            return {
              order: dom.hasAttribute("start")
                ? +dom.getAttribute("start")!
                : 1,
            };
          },
        },
      ],
      toDOM(node) {
        return node.attrs.order == 1
          ? ["ol", 0]
          : ["ol", { start: node.attrs.order }, 0];
      },
    } as NodeSpec,

    //Unordered List
    "unordered-list": {
      group: "block",
      content: "listitem+",
      parseDOM: [{ tag: "ul" }],
      toDOM() {
        return ["ul", 0];
      },
    } as NodeSpec,

    // Check List Item
    /*
      TODO: Create a way for check state to propogate.
      Using a mark seems to make the most sense, thought it would have to be designed in a wonky way
    */
    checklistitem: {
      attrs: { checked: { default: false } },
      parseDOM: [{ tag: `li[data-type="checklist"]` }],
      toDOM(node) {
        return [
          "li",
          { "data-type": "checklist" },
          [
            "label",
            [
              "input",
              {
                type: "checkbox",
                value: node.attrs.checked,
              },
            ],
            ["span"],
          ],
          ["div", 0],
        ];
      },
      defining: true,
      content: "paragraph block*",
    } as NodeSpec,

    //Unordered List
    "check-list": {
      group: "block",
      content: "checklistitem+",
      parseDOM: [{ tag: `ul[data-type="checklist"]` }],
      toDOM() {
        return ["ul", { "data-type": "checklist" }, 0];
      },
    } as NodeSpec,

    /* Inline =============================================================== */
    // Hard Bread
    "hard-break": {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    } as NodeSpec,

    // Text
    text: {
      group: "inline",
    } as NodeSpec,

    /* Complex ============================================================== */
    // Image
    image: {
      group: "block",
      attrs: { src: { default: "" }, height: { default: "" } },
      parseDOM: [{ tag: "img" }],
      toDOM(node) {
        return ["img", { src: node.attrs.src, height: node.attrs.height }];
      },
    },

    // Figure =============================================================== */
    // how we embed content from other docs
    figure: {
      group: "block",
      content: "(block caption)+",
      parseDOM: [{ tag: "figure" }],
      atom: true,
      toDOM(node) {
        return ["figure", 0];
      },
    } as NodeSpec,
  },
  marks: {
    /* Basic ================================================================ */
    // Italic
    italic: {
      parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
      toDOM() {
        return ["em", 0];
      },
    } as MarkSpec,

    // Bold
    strong: {
      parseDOM: [
        { tag: "strong" },
        {
          tag: "b",
          getAttrs: (node: HTMLElement) =>
            node.style.fontWeight != "normal" && null,
        },
        {
          style: "font-weight",
          getAttrs: (value: string) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM() {
        return ["strong", 0];
      },
    } as MarkSpec,

    // Underline
    underline: {
      parseDOM: [
        { tag: "u" },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style) =>
            (style as string).includes("underline") ? {} : false,
        },
      ],
      toDOM() {
        return ["u", 0];
      },
    } as MarkSpec,

    // Strike
    strike: {
      parseDOM: [
        {
          tag: "s",
        },
        {
          tag: "del",
        },
        {
          tag: "strike",
        },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style) =>
            (style as string).includes("line-through") ? {} : false,
        },
      ],
      toDOM() {
        return ["s", 0];
      },
    } as MarkSpec,

    // Code
    code: {
      inclusive: false,
      parseDOM: [
        {
          tag: "code",
        },
      ],
      toDOM() {
        return ["code", 0];
      },
    } as MarkSpec,

    /* links ================================================================ */
    // Web2 Hyperlink
    hyperlink: {
      inclusive: false,
      attrs: { href: { default: "" }, target: { default: "_blank" } },
      parseDOM: [{ tag: 'a[href]:not([href *= "javascript:" i])' }],
      toDOM(node) {
        return ["a", { href: node.attrs.href, target: node.attrs.target }, 0];
      },
    } as MarkSpec,

    // Comment Link
    comment: {
      attrs: { comment: { default: "{}" } },
      inclusive: false,
      excludes: "",
      parseDOM: [{ tag: "mark" }],
      toDOM() {
        return ["mark", 0];
      },
    } as MarkSpec,

    // Engram Concept Link
    concept: {
      attrs: { concept: { default: "" } },
      parseDOM: [{ tag: "abbr" }],
      toDOM(node) {
        return ["abbr", { title: node.attrs.concept }];
      },
    } as MarkSpec,

    // Azimuth
    azimuth: {
      attrs: { aref: { default: "" } },
      parseDOM: [{ tag: 'a[aref]:not([aref *= "javascript:" i])' }],
      toDOM(node) {
        return ["a", { aref: node.attrs.src }, 0];
      },
    } as MarkSpec,
  },
});

export default schema;

/* Helpers */

export function getNodeType(nameOrType: string | NodeType): NodeType {
  if (typeof nameOrType === "string") {
    if (!schema.nodes[nameOrType]) {
      throw Error(
        `There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`
      );
    }

    return schema.nodes[nameOrType];
  }

  return nameOrType;
}
