import {
  Schema,
  NodeSpec,
  NodeType,
  MarkSpec,
  MarkType,
  DOMOutputSpec,
} from "prosemirror-model";
import { ConfigSpec, ConfigTermSpec } from "./config/plugin";

export const protectedBlocks = new Set(["paragraph"]);

const schema = new Schema({
  nodes: {
    // Fundemental -------------------------------------------------------------
    doc: {
      content: "header block+",
      //content: "block+",
    } as NodeSpec,

    // Text
    text: {
      group: "inline",
    } as NodeSpec,

    // Header ------------------------------------------------------------------

    header: {
      content: "config title description{0,1}",
      group: "header",
      parseDOM: [{ tag: "header" }],
      toDOM() {
        return ["header", 0] as DOMOutputSpec;
      },
      selectable: false,
    } as NodeSpec,

    config: ConfigSpec,
    typefrequency: ConfigTermSpec("16"),
    typeratio: ConfigTermSpec("2"),
    headingtypeface: ConfigTermSpec("sans"),
    bodytypeface: ConfigTermSpec("sans"),
    documentwidth: ConfigTermSpec("60"),

    /*
    property: {
      content: "text*",
      group: "property",
      attrs: {
        type: { default: "text" },
        key: { default: "" },
        display: { default: "" },
      },
      parseDOM: [
        {
          tag: "dt",
          getAttrs(dom: string | HTMLElement) {
            return {
              type: (dom as HTMLElement).getAttribute("property-type"),
              key: (dom as HTMLElement).getAttribute("property-key"),
              display: (dom as HTMLElement).getAttribute("property-display"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "dt",
          {
            "property-type": node.attrs.type,
            "property-key": node.attrs.key,
            "property-display": node.attrs.display,
          },
        ];
      },
    },

    styling: {
      content: "property*",
      group: "config",
      parseDOM: [{ tag: `dl[data-type="style"]` }],
      toDOM() {
        return ["dl", { "data-type": "style" }, 0];
      },
    } as NodeSpec,

    preview: {
      content: "property*",
      group: "config",
      parseDOM: [{ tag: `dl[data-type="preview"]` }],
      toDOM() {
        return ["dl", { "data-type": "preview" }, 0];
      },
    },
    */

    // Title
    title: {
      content: "text*",
      group: "title",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: `h1[data-type="title"]` }],
      toDOM(node) {
        return [
          "h1",
          {
            "data-type": "title",
            ...(node.attrs.id ? { id: node.attrs.id } : {}),
          },
          0,
        ] as DOMOutputSpec;
      },
      selectable: true,
    },

    // Description
    description: {
      content: "inline*",
      group: "description",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: `div[data-type="description"]` }],
      toDOM(node) {
        return [
          "div",
          {
            "data-type": "description",
            ...(node.attrs.id ? { id: node.attrs.id } : {}),
          },
          0,
        ] as DOMOutputSpec;
      },
      selectable: true,
    },

    // Blocks ------------------------------------------------------------------
    // Paragraph
    paragraph: {
      content: "inline*",
      group: "block",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "p" }],
      toDOM(node) {
        return [
          "p",
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ] as DOMOutputSpec;
      },
    } as NodeSpec,

    // Heading
    heading: {
      content: "inline*",
      group: "block",
      attrs: { level: { default: 1 }, id: { default: null } },
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM(node) {
        return [
          `h${node.attrs.level}`,
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ] as DOMOutputSpec;
      },
      defining: true,
    } as NodeSpec,

    // Blockquote
    blockquote: {
      content: "block+",
      group: "block",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "blockquote" }],
      toDOM(node) {
        return [
          "blockquote",
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ];
      },
      defining: true,
    } as NodeSpec,

    // Blockquote
    "code-block": {
      content: "text*",
      group: "block",
      attrs: { id: { default: null } },
      code: true,
      defining: true,
      parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
      toDOM(node) {
        return ["pre", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    } as NodeSpec,

    /// A horizontal rule (`<hr>`).
    "horizontal-rule": {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      attrs: { id: { default: null } },
      toDOM(node) {
        return ["hr", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }];
      },
    } as NodeSpec,

    // List Item
    li: {
      content: "paragraph block*",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "li" }],
      toDOM(node) {
        return ["li", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
      defining: true,
    } as NodeSpec,

    // Ordered List
    "ordered-list": {
      group: "block",
      content: "li+",
      attrs: { order: { default: 1 }, id: { default: null } },
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
        return [
          "ol",
          {
            ...(node.attrs.order ? { start: node.attrs.order } : {}),
            ...(node.attrs.id ? { id: node.attrs.id } : {}),
          },
          0,
        ];
      },
    } as NodeSpec,

    //Unordered List
    "unordered-list": {
      group: "block",
      content: "li+",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "ul" }],
      toDOM(node) {
        return ["ul", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    } as NodeSpec,

    image: {
      group: "block",
      attrs: {
        src: { default: "" },
        alt: { default: null },
        title: { default: null },
        height: { default: null },
        id: { default: null },
      },
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs(dom: string | HTMLElement) {
            return {
              src: (dom as HTMLElement).getAttribute("src"),
              title: (dom as HTMLElement).getAttribute("title"),
              alt: (dom as HTMLElement).getAttribute("alt"),
              height: (dom as HTMLElement).getAttribute("height"),
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "img",
          {
            src: node.attrs.src,
            ...(node.attrs.alt ? { alt: node.attrs.alt } : {}),
            ...(node.attrs.title ? { alt: node.attrs.title } : {}),
            ...(node.attrs.height
              ? { style: { height: node.attrs.height + "px" } }
              : {}),
            ...(node.attrs.id ? { id: node.attrs.id } : {}),
          },
        ];
      },
    },

    // Inline ------------------------------------------------------------------
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
  },
  marks: {
    /* Basic ================================================================ */
    // Italic
    italic: {
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
      toDOM() {
        return ["em", 0];
      },
    } as MarkSpec,

    // Bold
    strong: {
      attrs: { id: { default: null } },
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
      toDOM(node) {
        return [
          "strong",
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ];
      },
    } as MarkSpec,

    // Underline
    underline: {
      attrs: { id: { default: null } },
      parseDOM: [
        { tag: "u" },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style) =>
            (style as string).includes("underline") ? {} : false,
        },
      ],
      toDOM(node) {
        return ["u", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    } as MarkSpec,

    // Strike
    strike: {
      attrs: { id: { default: null } },
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
      toDOM(node) {
        return ["s", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    } as MarkSpec,

    // Code
    code: {
      attrs: { id: { default: null } },
      code: true,
      parseDOM: [
        {
          tag: "code",
        },
      ],
      toDOM(node) {
        return ["code", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    } as MarkSpec,

    // Hypertext ---------------------------------------------------------------
    // Web2 Hyperlink
    hyperlink: {
      attrs: { href: { default: "" }, target: { default: "_blank" } },
      parseDOM: [{ tag: 'a[href]:not([href *= "javascript:" i])' }],
      toDOM(node) {
        return [
          "a",
          {
            href: node.attrs.href,
            target: node.attrs.target,
            ...(node.attrs.id ? { id: node.attrs.id } : {}),
          },
          0,
        ];
      },
    } as MarkSpec,

    urbitlink: {
      inclusive: false,
      attrs: {
        href: { default: "" },
        "data-type": { default: "urbit" },
      },
      parseDOM: [{ tag: 'abbr[data-type="urbit"]' }],
      toDOM(node) {
        return [
          "abbr",
          {
            href: node.attrs.href,
            "data-type": "urbit",
          },
          0,
        ];
      },
    } as MarkSpec,

    // Comment Link
    markup: {
      attrs: { comment: { default: "{}" } },
      inclusive: false,
      excludes: "",
      parseDOM: [{ tag: "mark" }],
      toDOM() {
        return ["mark", 0];
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

export function getMarkType(nameOrType: string | MarkType): MarkType {
  if (typeof nameOrType === "string") {
    if (!schema.marks[nameOrType]) {
      throw Error(
        `There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`
      );
    }

    return schema.marks[nameOrType];
  }

  return nameOrType;
}
