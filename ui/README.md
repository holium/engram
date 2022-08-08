# State

```
state = {
  documents: Array<number>,
  folders: Array<...>,
  ship: number,                       // need to be globally accessible
  theme: {},                          // get from realm useEffect( setCssProperties, [])
  contextmenus: Array<ContextMenu>,   // need to be globally push & remove

  // urbit / connection status
  // something to send messages
  // watch connection
  // etc.
}

// can be requested with an id
DocumentMeta = {
  id: number,
  name: string,
  owner: string,
}

// Folder Meta
FolderMeta = {
  open: boolean,
  // NEEDS TO BE FIGURED OUT
}

ContextMenu = {
  top: number,
  left: number,
  items: Array<SuggestionItem>
}

Document = {
  // core
  document: Y.Doc,
  view: EditorView,
}

Router = {
  {
    path: "/"
    name: "Root"
  },
  {
    path: "/:id"
    name: "Document"
  }
}
```
