# Engram

## Getting Started

In order to run Engram locally you'll need to [boot a fake ship](https://developers.urbit.org/guides/core/environment#creating-a-fake-ship).
Once you've got your ship running, run the following commands on your ship.

```
> |merge %engram our %base
>=
> |mount %engram
>=
```

In a new terminal, navigate to your ship and copy over your files from the `/desk` folder into your ship's `/engram` folder.

```
$ rm -r ./zod/engram/*
$ cp -r ./engram/desk/* ./zod/engram/
```

While in this terminal build the ui files. This will create a build folder we will use later.

```
$ cd ./engram/ui
$ npm install
$ npm run build
```

With the desk copied over and the ui built you can navigate back to your ship. From your ship commit and install engram:

```
> |commit %engram
>=
> |install our %engram
>=
```

Now you can open up landscape in your browser, navigate to `/docket/upload` and upload the build file we created earlier.
Be sure to select `engram` as the desk. Then hit `glob!` to run the upload.

Once that's done you can run engram from landscape.

## Hoon

### Types

_Note_: Types are described as name {Aura}

Data Types:

- `edits {list @t}`: This is the list of actual changes passed from prosemirror to the backend.
- `chg {author=@p from=@ud to=@ud edit=edits type=@t}`: This is an actual change sent from prosemirror to the backend. These can later be used as a building block to allow for version indexing
- `hist {list chg}`: This is the change history of a valid document. This is the structure that will, with slight modifications, allow for version history.
- `doc {owner=@p id:@sw}`: This right now can be defined as document metadata. It is basically identifiable information that allows document indexing. This will very likely be expanded upon in the future.
- `docs {jar doc hist}`: This is a key-value with keys being document metadata (doc) and the value being the history of the document. This can effectively be though of as indexing by metadata and storing the document content.

Actions:

- `%make`: This is the action for a user to create a new document
- `%modify`: This is the action for a user to modify the document in the form of posting a change to the change log
- `%delete`: This is the action for a user to delete one of their existing documents
