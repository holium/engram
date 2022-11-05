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
+$  access  $%(%read %write %admin)
::
::  Organisms
+$  type  $%(%document %folder)
+$  iupdate  [content=(map @p (set [id type])) dels=(set [id id])]
+$  index  [version=version content=(map id [id type]) dels=(map id id)]
::
::  Documents
+$  dversion   tape
+$  dcontent   tape
+$  dsettings  [owner=@p name=@t roles=(map @tas access) ships=(map @p access)]
+$  dsnapshot  [timestamp=@da author=@p data=tape]
+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion content=dcontent settings=dsettings snapshots=(list dsnapshot)]
::
::  Folders
+$  folder  [id=id name=@t roles=(map @tas access) ships=(map @p access) content=index]
::
::  Spaces
+$  spath  [ship=ship space=@p]
+$  space  [roles=(map @tas access) ships=(map @p access) content=index]

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
      $%  [%make =@t =dcontent =dversion =(map @tas @tas) =(map @p @tas)]
          [%delete =path]
          [%save =path =dcontent =dversion]
          ::[%docsetup =dmeta =doc =stg]
          ::[%createsnap =dmeta]
          [%snap =path =dsnapshot]
          ::[%dsnap =dmeta]
          [%settings =path =@ta =(map @tas @tas) =(map @p @tas)]
          ::[%dsettings =dmeta]
      ==
    ==
    $:  %folder
      $%  [%make =@t =(map @tas @tas) =(map @p @tas)]
          [%delete =path]
          [%add =path =path]
          [%remove =path =path]
          ::[%renamefolder old=fmeta new=fmeta]
      ==
    ==
    $:  %prop
      $%  [%accept =path =dupdate]
          [%sub =path to=@p]
          [%unsub from=@p]
          ::[%update =id =dupdate]
          [%update-live =path =dupdate]
      ==
    ==
  ==
--
::+$  update
::  $%  [%init =dmeta =doc =stg setupt=(set updt)]
::      [%update =dmeta =updt]
::  ==
::--
