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
::
+$  id  @
+$  athr  @p
+$  dcont  (list @ud)
+$  updt  [author=athr cont=dcont time=@da]
+$  ver  (list @ud)
+$  doc  [version=ver cont=dcont]
+$  dmeta  [owner=athr id=id]
::
:: State Data Types
:: updts: a key-list storage for the staged updates ready to be merged into your current document
:: docs: a key-list storage for the viewable documents 
::
+$  updts  (jar dmeta updt)
+$  docs  (jar dmeta doc)
::
:: +$  action
  :: $%  [%make =doc]
      :: [%modify =doc =chg]
      :: [%delete =doc]
  :: ==
--