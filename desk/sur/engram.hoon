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
+$  id  @
+$  athr  @p
+$  dcont  (list @ud)
+$  updt  [author=athr cont=dcont time=@da]
+$  ver  (list @ud)
+$  doc  [version=ver cont=dcont]
+$  dmeta  [id=id timestamp=@d]
+$  whtlst  (list @p)
+$  stg  [perms=whtlst owner=@p name=@t]
+$  fmeta  [id=id name=@t]
+$  snap  [date=@d ship=@p data=(list @ud)]
+$  fldr
  $%  [%doc =dmeta]
      [%folder =fmeta]
  ==
::
:: State Data Types
:: updts: a key-set storage for the staged updates ready to be merged into your current document
:: docs: a key-set storage for the viewable documents
:: fldrs: all folders for a specific document
:: dsnaps: a key-list store for snapshot containers
::
::
+$  updts  (jug dmeta updt)
+$  docs  (map dmeta doc)
+$  fldrs  (jug fmeta fldr)
+$  dstgs  (map dmeta stg)
+$  dsnaps  (jar dmeta snap)
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
      [%createsnap =dmeta]
      [%save =dmeta =doc]
      [%delete =dmeta]
      [%settings =dmeta =stg]
      [%mfolder =fmeta]
      [%dfolder =fmeta]
      [%foldoc =fmeta =fldr]
      [%remfoldoc =fmeta =fldr]
      [%merge =dmeta =@ud]
      [%snap =dmeta =snap]
      ::[%sub =@p]
      ::[%unsub =@p]
  ==
+$  update
  $%  [%sub =dmeta]
  ==
--
