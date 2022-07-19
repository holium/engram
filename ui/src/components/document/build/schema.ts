import {
  Schema,
  NodeSpec,
  NodeType,
  MarkSpec,
  DOMOutputSpec,
} from "prosemirror-model";

const schema = new Schema({
  nodes: {
    // Document
    doc: {
      content: "header block+",
    } as NodeSpec,

    header: {
      content: "title description{0,1}",
      group: "header",
      parseDOM: [{ tag: "header" }],
      toDOM() {
        return ["header", 0] as DOMOutputSpec;
      },
    } as NodeSpec,

    // Title
    title: {
      content: "text*",
      group: "title",
      parseDOM: [{ tag: `h1[data-type="header"]` }],
      toDOM() {
        return ["h1", { "data-type": "header" }, 0] as DOMOutputSpec;
      },
    },

    // Description
    description: {
      content: "inline*",
      group: "description",
      parseDOM: [{ tag: `p[data-type="header"]` }],
      toDOM() {
        return ["p", { "data-type": "header" }, 0] as DOMOutputSpec;
      },
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

    // Aside
    aside: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "aside" }],
      toDOM() {
        return ["aside", 0];
      },
      defining: true,
    } as NodeSpec,

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
      atts: { checked: { default: false } },
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
  },
  marks: {
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
        style: 'text-decoration',
        consuming: false,
        getAttrs: style => ((style as string).includes('underline') ? {} : false),
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
        tag: 's',
      },
      {
        tag: 'del',
      },
      {
        tag: 'strike',
      },
      {
        style: 'text-decoration',
        consuming: false,
        getAttrs: style => ((style as string).includes('line-through') ? {} : false),
      },
      ],
      toDOM() {
        return ["s", 0];
      },
    } as MarkSpec,

    // Code
    code: {
      parseDOM: [
        {
        tag: 'code',
      },
      ],
      toDOM() {
        return ["code", 0];
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
