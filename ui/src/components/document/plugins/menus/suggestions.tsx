import { EditorView } from "prosemirror-view";
import { TextSelection } from "prosemirror-state";
import { Command, setBlockType, wrapIn } from "prosemirror-commands";
import { insertAtNextPossible } from "../shortcuts.ts";
import schema from "../../build/schema.ts";

export interface SuggestionItem {
  key: string;
  display: string;
  command: (view: EditorView, pos?: number) => void;
}

const suggestions: { [key: string]: SuggestionItem } = {
  paragraph: {
    key: "paragraph",
    display: "Paragraph",
    description: "Basic text paragraph",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 6v15h-2v-5a6 6 0 1 1 0-12h10v2h-3v15h-2V6h-3zm-2 0a4 4 0 1 0 0 8V6z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      if (pos) {
        const $pos = view.state.doc.resolve(pos);
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes.paragraph)(view.state, view.dispatch, view);
    },
  },
  h1: {
    key: "h1",
    display: "Heading 1",
    description: "Big section heading",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      console.log(view.state.selection);
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
    },
  },
  h2: {
    key: "h2",
    display: "Heading 2",
    description: "Medium section heading",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z" />
        </svg>
      );
    },
    command: (view, pos?) => {
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
    },
  },
  h3: {
    key: "h3",
    display: "Heading 3",
    description: "Small section heading",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z" />
        </svg>
      );
    },
    command: (view, pos?) => {
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
    },
  },
  blockquote: {
    key: "blockquote",
    display: "Quote",
    description: "Display a quote",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      if (pos) {
        const $pos = view.state.doc.resolve(pos);
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      wrapIn(schema.nodes["blockquote"])(view.state, view.dispatch, view);
    },
  },
  "code-block": {
    key: "code",
    display: "Code Block",
    description: "Display a section of code",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      if (pos) {
        const $pos = view.state.doc.resolve(pos);
        const tr = view.state.tr.setSelection(new TextSelection($pos));
        view.dispatch(tr);
      }
      setBlockType(schema.nodes["code-block"])(view.state, view.dispatch, view);
    },
  },
  hr: {
    key: "hr",
    display: "Horizontal Rule",
    description: "Visually divide the document",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            minWidth: "32px",
            width: "32px",
            height: "32px",
            transform: "rotate(90)",
          }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M20 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h16zm-9 2H5v14h6v-4h2v4h6V5h-6v4h-2V5zm4 4l3 3-3 3v-2H9v2l-3-3 3-3v2h6V9z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      if (pos) {
        insertAtNextPossible(
          view,
          pos,
          schema.nodes["horizontal-rule"].create()
        );
      } else {
        const sel = view.state.selection;
        insertAtNextPossible(
          view,
          sel.head,
          schema.nodes["horizontal-rule"].create()
        );
      }
    },
  },
  image: {
    key: "image",
    display: "Image",
    description: "Upload or link and image",
    icon: () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ minWidth: "32px", width: "32px", height: "32px" }}
          fill="var(--type-color)"
          className="m-2"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm11.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      );
    },
    command: (view, pos?) => {
      if (pos) {
        insertAtNextPossible(
          view,
          pos,
          schema.nodes["image"].create({
            src: "https://avalonlabs.earth/_nuxt/img/point-loma.ff5a71c.png",
          })
        );
      } else {
        const sel = view.state.selection;
        insertAtNextPossible(
          view,
          sel.head,
          schema.nodes["image"].create({
            src: "https://avalonlabs.earth/_nuxt/img/point-loma.ff5a71c.png",
          })
        );
      }
    },
  },
};

export default suggestions;
