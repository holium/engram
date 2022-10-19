/*
import {
  Schema,
  NodeSpec,
  NodeType,
  MarkSpec,
  MarkType,
  DOMOutputSpec,
} from "prosemirror-model";
*/
//import { ConfigSpec, ConfigTermSpec } from "./config/plugin";
import { Schema, NodeType, MarkType } from "prosemirror-model";
//import { NodeSpec } from "prosemirror-model";

export const protectedBlocks = new Set(["paragraph"]);

const schema = new Schema({
  nodes: {
    // Fundemental -------------------------------------------------------------
    doc: {
      content: "header block+",
    },

    // Text
    text: {
      group: "inline",
    },

    // Header -----------------------------------------------------------------
    header: {
      content: "cover{0, 1} title description{0, 1}",
      group: "header",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "header" }],
      toDOM(node) {
        return ["header", 0];
      },
    },

    title: {
      content: "text*",
      group: "meta",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: `h1[name="title"]` }],
      toDOM(node) {
        return ["h1", { name: "title" }, 0];
      },
    },

    cover: {
      content: "text*",
      group: "meta",
      attrs: { id: { default: null }, src: { default: "" } },
      parseDOM: [
        {
          tag: `img[name="title"]`,
          getAttrs(dom: string | HTMLElement) {
            return {
              src: (dom as HTMLElement).getAttribute("src"),
            };
          },
        },
      ],
      toDOM(node) {
        return ["img", { name: "title", src: node.attrs.src }];
      },
    },

    description: {
      content: "inline*",
      group: "meta",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: `p[name="description"]` }],
      toDOM(node) {
        return ["p", { name: "description" }, 0];
      },
    },

    // Blocks ------------------------------------------------------------------
    // Paragraph
    paragraph: {
      content: "inline*",
      group: "block",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "p" }],
      toDOM(node) {
        return ["p", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    },

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
        ];
      },
      defining: true,
    },

    // Blockquote
    blockquote: {
      content: "inline*",
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
    },

    marquee: {
      content: "inline*",
      group: "block",
      attrs: {
        id: { default: null },
        direction: { default: "up", behavior: "scroll" },
      },
      parseDOM: [{ tag: "marquee" }],
      toDOM(node) {
        return [
          "marquee",
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ];
      },
      defining: true,
    },

    // Code Block
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
    },

    /// A horizontal rule (`<hr>`).
    "horizontal-rule": {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      attrs: { id: { default: null } },
      toDOM(node) {
        return ["hr", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }];
      },
    },

    // List Item
    li: {
      content: "paragraph block*",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "li" }],
      toDOM(node) {
        return ["li", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
      defining: true,
    },

    // Ordered List
    "ordered-list": {
      group: "block",
      content: "li+",
      attrs: { order: { default: 1 }, id: { default: null } },
      parseDOM: [
        {
          tag: "ol",
          getAttrs(dom: string | HTMLElement) {
            return {
              order: (dom as HTMLElement).hasAttribute("start")
                ? +(dom as HTMLElement).getAttribute("start")!
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
    },

    //Unordered List
    "unordered-list": {
      group: "block",
      content: "li+",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "ul" }],
      toDOM(node) {
        return ["ul", { ...(node.attrs.id ? { id: node.attrs.id } : {}) }, 0];
      },
    },

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
    },
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
    },

    // Bold
    strong: {
      attrs: { id: { default: null } },
      parseDOM: [
        { tag: "strong" },
        {
          tag: "b",
          getAttrs: (node: string | HTMLElement) =>
            (node as HTMLElement).style.fontWeight != "normal" && null,
        },
        {
          style: "font-weight",
          getAttrs: (value: string | HTMLElement) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
        },
      ],
      toDOM(node) {
        return [
          "strong",
          { ...(node.attrs.id ? { id: node.attrs.id } : {}) },
          0,
        ];
      },
    },

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
    },

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
    },

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
    },

    // Hypertext ---------------------------------------------------------------
    ameslink: {
      priority: 100,
      inclusive: false,
      attrs: {
        href: { default: "" },
      },
      parseDOM: [{ tag: 'a[href*="engram://"]' }],
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
    },
    // Hyperlink
    hyperlink: {
      priority: 90,
      attrs: { href: { default: "" }, target: { default: "_blank" } },
      parseDOM: [
        {
          tag: 'a[href]:not([href *= "engram://"]):not([href *= "javascript:" i])',
        },
      ],
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
    },

    // Comment Link
    markup: {
      attrs: { comment: { default: "{}" } },
      inclusive: false,
      excludes: "",
      parseDOM: [{ tag: "mark" }],
      toDOM() {
        return ["mark", 0];
      },
    },
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
