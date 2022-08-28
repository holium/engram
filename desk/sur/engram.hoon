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
:: fldr: contents of a folder, either a document index or a folder index
:: fldrs: the actual folder object for indexing the different folders
::
+$  id  @
+$  athr  @p
+$  dcont  (list @ud)
+$  updt  [author=athr cont=dcont time=@da]
+$  ver  (list @ud)
+$  doc  [version=ver cont=dcont]
+$  dmeta  [owner=athr id=id name=@t]
+$  whtlst  (list @p)
+$  stg  [perms=whtlst]
+$  fmeta  [id=id name=@t]
+$  fldr
  $%  [%doc =dmeta]
      [%folder =fmeta]
  ==
::
:: State Data Types
:: updts: a key-list storage for the staged updates ready to be merged into your current document
:: docs: a key-list storage for the viewable documents 
:: dfldrs: all folders for a specific document
::
+$  updts  (jug dmeta updt)
+$  docs  (map dmeta doc)
+$  fldrs  (jug fmeta fldr)
+$  dstgs  (map dmeta stg)
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
::
+$  action
  $%  [%make =dmeta =doc]
      [%save =dmeta =doc]
      [%delete =dmeta]
      [%settings =dmeta =stg]
      [%mfolder =fmeta]
      [%dfolder =fmeta]
      [%foldoc =fmeta =fldr]
      [%remfoldoc =fmeta =fldr]
      [%merge =dmeta =@ud]
      [%sub =@p] 
      [%unsub =@p]
  ==
+$  update
  $%  [%sub =dmeta]
  ==
--