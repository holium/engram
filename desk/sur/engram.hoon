|%
::
:: Basic Data Types
:: id: document id for indexing the different documents
:: athr: author of the staged changes
:: dcont: list of document state encoded from yjs
:: updt: update metadata and content for staged changes
:: ver: document version for merging states
:: doc: document data (version and content)
:: dmeta: document metadata for indexing purposes
:: whtlst: document whitelist for who is able to access a specific document
:: stg: document settings
:: fmeta: folder metadata for indexing purposes
:: snap: snapshot to be able to store fixed timestamp history
:: fldr: contents of a folder, either a document index or a folder index
::
+$  fmeta  [id=id name=@t]
+$  fldr
  $%  [%doc =dmeta]
      [%folder =fmeta]
  ==
::
::  Basic Types
+$  id  [@p @u]
+$  clock  @u
+$  version (map @p clock)
::
::  Sharing Types
+$  access  $%(%read %write %admin)
::
::  Organisms
+$  type  $%(%document %folder)
+$  index  [version=version content=(map id [id type]) dels=(map id id)]
::
::  Documents
+$  dversion   (list @t)
+$  dcontent   (list @t)
+$  dsettings  [owner=@p name=@t roles=(map @tas access) ships=(map @p access)]
+$  dsnapshot  [timestamp=@da author=@p version=dversion]
+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion content=dcontent settings=dsettings snapshots=(list dsnapshot)]
::
::  Folders
+$  folder  [id=id name=@t roles=(map @tas access) ships=(map @p access) content=index]
::
::  Spaces
+$  spath  [ship=ship space=name]
+$  space  [roles=(map @tas access) ships=(map @p access) content=index]

::
:: State Data Types
:: updts: a key-set storage for the staged updates ready to be merged into your current document
:: docs: a key-set storage for the viewable documents
:: fldrs: all folders for a specific document
:: dsnaps: a key-list store for snapshot containers
::
::

+$  clock  clock
+$  spaces  (map spath space)
+$  updates  (jug id dupdate)
+$  documents  (map id doc)
+$  folders  (jug id folder)
::
:: Poke Actions
:: [%make =dmeta] - Create a new document within the state
:: [%save =dmeta =doc =updt] - save a document in your state
:: [%delete =dmeta] - remove a document from your state and the other ships
:: [%settings =dmeta =stg] - update the document settings
:: [%mfolder =fmeta] - create a folder
:: [%dfolder =fmeta] - delete a folder
:: [%foldoc =fmeta =fldr] - add a document or folder pointer to a specified folder
:: [%remfoldoc =fmeta =fldr] - remove a document or folder pointer from a specified folder
:: [%merge =dmeta =@ud] - remove a specific update from the update list
:: [%snap =dmeta =snap] - add a snapshot to a documents history
::
+$  action
  $%  [%make =dmeta =doc]
      [%docsetup =dmeta =doc =stg]
      [%createsnap =dmeta]
      [%snap =dmeta =snap]
      [%dsnap =dmeta]
      [%save =dmeta =doc]
      [%delete =dmeta]
      [%settings =dmeta =stg]
      [%dsettings =dmeta]
      [%mfolder =fmeta]
      [%dfolder =fmeta]
      [%foldoc =fmeta =fldr]
      [%remfoldoc =fmeta =fldr]
      [%renamefolder old=fmeta new=fmeta]
      [%merge =dmeta =updt]
      [%sub =dmeta owner=@p]
      [%unsub owner=@p]
      [%update =dmeta =updt]
      [%update-live =dmeta =updt]
      [%extend dmeta=dmeta updts=(set updt)]
  ==
+$  update
  $%  [%init =dmeta =doc =stg setupt=(set updt)]
      [%update =dmeta =updt]
  ==
--
