# Engram

## Hoon

### Types

*Note*: Types are described as name {Aura}

Data Types:

- `edits {list @t}`: This is the list of actual changes passed from prosemirror to the backend.
- `chg {author=@p from=@ud to=@ud edit=edits type=@t}`: This is an actual change sent from prosemirror to the backend.  These can later be used as a building block to allow for version indexing
- `hist {list chg}`: This is the change history of a valid document.  This is the structure that will, with slight modifications, allow for version history.
- `doc {owner=@p id:@sw}`: This right now can be defined as document metadata.  It is basically identifiable information that allows document indexing.  This will very likely be expanded upon in the future.
- `docs {jar doc hist}`: This is a key-value with keys being document metadata (doc) and the value being the history of the document.  This can effectively be though of as indexing by metadata and storing the document content.

Actions:

- `%make`: This is the action for a user to create a new document
- `%modify`: This is the action for a user to modify the document in the form of posting a change to the change log
- `%delete`: This is the action for a user to delete one of their existing documents
