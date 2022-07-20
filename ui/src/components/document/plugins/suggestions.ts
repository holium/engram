import { EditorView } from "prosemirror-view"
import { TextSelection } from "prosemirror-state"
import { Command, setBlockType, wrapIn,  } from "prosemirror-commands"
import { insertAtNextPossible } from "./shortcuts.ts"
import schema from "../build/schema.ts"

export interface SuggestionItem {
  key: string,
  display: string,
  command: (view: EditorView, pos?: number) => void
}

const suggestions: { [key: string]: SuggestionItem } = {
  "paragraph": {
    key: "paragraph",
    display: "Paragraph",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes.paragraph)(view.state, view.dispatch, view)
    }
  },
  "h1": {
    key: "h1",
    display: "Heading 1",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes.heading, { level: 1 })(view.state, view.dispatch, view)
    }
  },
  "h2": {
    key: "h2",
    display: "Heading 2",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes.heading, { level: 2 })(view.state, view.dispatch, view)
    }
  },
  "h3": {
    key: "h3",
    display: "Heading 3",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes.heading, { level: 3 })(view.state, view.dispatch, view)
    }
  },
  "blockquote": {
    key: "blockquote",
    display: "Quote",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      wrapIn(schema.nodes["blockquote"])(view.state, view.dispatch, view)
    }
  },
  "aside": {
    key: "aside",
    display: "Aside",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes["aside"])(view.state, view.dispatch, view)
    }
  },
  "code-block": {
    key: "code",
    display: "Code Block",
    command: (view, pos?) => {
      if(pos) {
        const $pos = view.state.doc.resolve(pos)
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes["code-block"])(view.state, view.dispatch, view)
    }
  },
  "hr": {
    key: "hr",
    display: "Horizontal Rule",
    command: (view, pos?) => {
      if(pos) {
        insertAtNextPossible(view, pos, schema.nodes["horizontal-rule"].create())
      } else {
        const sel = view.state.selection;
        insertAtNextPossible(view, sel.head, schema.nodes["horizontal-rule"].create())
      }
    }
  },
  "image": {
    key: "image",
    display: "Image",
    command: (view, pos?) => {
      if(pos) {
        insertAtNextPossible(view, pos, schema.nodes["image"].create({ src: "https://avalonlabs.earth/_nuxt/img/point-loma.ff5a71c.png" }))
      } else {
        const sel = view.state.selection;
        insertAtNextPossible(view, sel.head, schema.nodes["image"].create({ src: "https://avalonlabs.earth/_nuxt/img/point-loma.ff5a71c.png" }))
      }
    }
  },
}

export default suggestions
