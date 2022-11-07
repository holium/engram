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
::+$  fmeta  [id=id name=@t]
::+$  fldr
::  $%  [%doc =dmeta]
::      [%folder =fmeta]
::  ==
::
::  Basic Types
+$  id  [@p @u]
+$  clock  @u
+$  version  (map @p clock)
::
::  Sharing Types
::+$  access  $%(%read %write %admin)
::
::  Organisms
+$  type  $%(%document %folder)
+$  iupdate  [content=(map @p (set [id type])) dels=(set [id id])]
+$  index  [version=version content=(map id [id type]) dels=(map id id)]
::
::  Documents
+$  dversion   tape
+$  dcontent   tape
+$  dsettings  [owner=@p name=@t roles=(map @tas @tas) ships=(map @p @tas)]
+$  dsnapshot  [timestamp=@da author=@p data=tape]
+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion content=dcontent settings=dsettings snapshots=(set dsnapshot)]
::
::  Folders
+$  folder  [id=id name=@t roles=(map @tas @tas) ships=(map @p @tas) content=index]
::
::  Spaces
+$  spath  path
+$  space  [roles=(map @tas @tas) ships=(map @p @tas) content=index]

::
:: State Data Types
:: updts: a key-set storage for the staged updates ready to be merged into your current document
:: docs: a key-set storage for the viewable documents
:: fldrs: all folders for a specific document
:: dsnaps: a key-list store for snapshot containers
::
::

+$  localtime  clock
+$  spaces  (map spath space)
+$  updates  (jug id dupdate)
+$  documents  (map id document)
+$  folders  (map id folder)
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
  $% 
    $:  %document
      $%  [%make owner=@p name=@t space=path version=dversion content=dcontent roles=(map @tas @tas) ships=(map @p @tas)]
          [%delete path=path]
          [%save path=path content=dcontent version=dversion]
          ::[%docsetup =dmeta =doc =stg]
          ::[%createsnap =dmeta]
          [%snap path=path snapshot=dsnapshot]
          ::[%dsnap =dmeta]
          [%settings path=path owner=@p name=@ta roles=(map @tas @tas) ships=(map @p @tas)]
          ::[%dsettings =dmeta]
      ==
    ==
    $:  %folder
      $%  [%make name=@t roles=(map @tas @tas) ships=(map @p @tas)]
          [%delete path=path]
      ::    [%add to=path id=path]
      ::    [%remove from=path id=path]
          [%rename path=path name=@t]
      ==
    ==
    $:  %prop
      $%  [%accept path=path update=dupdate]
          [%sub path=path to=@p]
          [%unsub from=@p]
          [%update path=path update=dupdate]
          [%update-live path=path update=dupdate]
      ==
    ==
  ==
+$  update
  $%  [%init id=id settings=dsettings updates=(set dupdate)]
      [%update id=id update=dupdate]
  ==
--
