import type { EditorView } from "prosemirror-view";
import { TextSelection } from "prosemirror-state";
import { setBlockType, wrapIn } from "prosemirror-commands";
import { createNodeNear } from "./commands";
import schema from "./schema";
import { view } from "./render";
import type { MenuItem } from "../../menus/types"

export interface SuggestionItem extends MenuItem {
    key: string,
    display: string,
    description: string,
    icon: string,
    command: (pos?: number) => boolean,
}

export const suggestions: Array<SuggestionItem> = [
    {
      key: "paragraph",
      display: "Paragraph",
      description: "Basic text paragraph",
      icon: "",
      command: (pos?) => {
        if (pos) {
          const $pos = view.state.doc.resolve(pos);
          const tr = view.state.tr.setSelection(new TextSelection($pos));
          view.dispatch(tr);
        }
        setBlockType(schema.nodes.paragraph)(view.state, view.dispatch, view);
        return true;
      },
    },
    {
      key: "h1",
      display: "Heading 1",
      description: "Big section heading",
      icon: "",
      command: (pos?) => {
        if (pos) {
          const $pos = view.state.doc.resolve(pos);
          const tr = view.state.tr.setSelection(new TextSelection($pos));
          view.dispatch(tr);
        }
        setBlockType(schema.nodes.heading, { level: 1 })(
          view.state,
          view.dispatch,
          view
        );
        return true;
      },
    },
    {
      key: "h2",
      display: "Heading 2",
      description: "Medium section heading",
      icon: "",
      command: (pos?) => {
        if (pos) {
          const $pos = view.state.doc.resolve(pos);
          const tr = view.state.tr.setSelection(new TextSelection($pos));
          view.dispatch(tr);
        }
        setBlockType(schema.nodes.heading, { level: 2 })(
          view.state,
          view.dispatch,
          view
        );
        return true;
      },
    },
    {
      key: "h3",
      display: "Heading 3",
      description: "Small section heading",
      icon: "",
      command: (pos?) => {
        if (pos) {
          const $pos = view.state.doc.resolve(pos);
          const tr = view.state.tr.setSelection(new TextSelection($pos));
          view.dispatch(tr);
        }
        setBlockType(schema.nodes.heading, { level: 3 })(
          view.state,
          view.dispatch,
          view
        );
        return true;
      },
    },
    {
      key: "code",
      display: "Code Block",
      description: "Display a section of code",
      icon: "",
      command: (pos?) => {
        if (pos) {
          const $pos = view.state.doc.resolve(pos);
          const tr = view.state.tr.setSelection(new TextSelection($pos));
          view.dispatch(tr);
        }
        setBlockType(schema.nodes["code-block"])(view.state, view.dispatch, view);
        return true;
      },
    },
    {
      key: "hr",
      display: "Horizontal Rule",
      description: "Visually divide the document",
      icon: "",
      command: (pos?) => {
        if (pos) {
          createNodeNear(schema.nodes["horizontal-rule"], pos)(
            view.state,
            view.dispatch
          );
        } else {
          const sel = view.state.selection;
          createNodeNear(schema.nodes["horizontal-rule"], sel.head)(
            view.state,
            view.dispatch
          );
        }
        return true;
      },
    },
    {
      key: "image",
      display: "Image",
      description: "Upload or link and image",
      icon: "",
      command: (pos?) => {
        if (pos) {
          createNodeNear(schema.nodes["image"], pos)(view.state, view.dispatch);
        } else {
          const sel = view.state.selection;
          createNodeNear(schema.nodes["image"], sel.head)(
            view.state,
            view.dispatch
          );
        }
        return true;
      },
    },
];