import { EditorView } from "prosemirror-view"
import { Command, setBlockType } from "prosemirror-commands"
import schema from "../build/schema.ts"

export interface SuggestionItem {
  key: string,
  display: string,
  command: (view) => void
}

const suggestions: { [key: string]: SuggestionItem } = {
  "paragraph": {
    key: "paragraph",
    display: "Paragraph",
    command: (view: EditorView) => {
      setBlockType(schema.nodes.paragraph)(view.state, view.dispatch, view)
    }
  },
  "h1": {
    key: "h1",
    display: "Heading 1",
    command: (view: EditorView) => {
      setBlockType(schema.nodes.heading, { level: 1 })(view.state, view.dispatch, view)
    }
  },
  "h2": {
    key: "h2",
    display: "Heading 2",
    command: (view: EditorView) => {
      setBlockType(schema.nodes.heading, { level: 2 })(view.state, view.dispatch, view)
    }
  },
  "h3": {
    key: "h3",
    display: "Heading 3",
    command: (view: EditorView) => {
      setBlockType(schema.nodes.heading, { level: 3 })(view.state, view.dispatch, view)
    }
  },
}

export default suggestions
