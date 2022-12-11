/-  *index
/+  *index
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
::  Sharing Types
::+$  access  $%(%read %write %admin)
::
::  Organisms
::  Documents
+$  dversion   tape
+$  dcontent   tape
+$  dsettings  [owner=@p name=@t space=path roles=(index [@tas @tas]) ships=(index [@p @tas])]
+$  dsnapshot  [timestamp=@da author=@p data=tape]
+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion content=dcontent settings=dsettings snapshots=(set dsnapshot)]
::
::  Folders
+$  folder  [id=id owner=@p name=@t space=path roles=(index [@tas @tas]) ships=(index [@p @tas]) content=(index [id @tas])]
::
::  Spaces
+$  spath  path
+$  space  [roles=(index [@tas @tas]) ships=(index [@p @tas]) content=(index [id @tas])]

::
:: State Data Types
:: updts: a key-set storage for the staged updates ready to be merged into your current document
:: docs: a key-set storage for the viewable documents
:: fldrs: all folders for a specific document
:: dsnaps: a key-list store for snapshot containers
::
::

+$  localtime  clock
+$  history  (list id)
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
          [%snap path=path snapshot=dsnapshot]
          [%rename path=path name=@t]
          [%addperm path=path perm=@t level=@tas type=@tas]
          [%removeperm path=path item=path type=@tas]
          [%gatherall path=path]
          [%gather path=path peer=@p]
          [%delta path=path]
          [%sync path=path update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(set dupdate)]]
          [%request path=path peer=@p]
          [%answer path=path]
          [%populate path=path doc=document]
          [%accept path=path update=dupdate]
      ==
    ==
    $:  %folder
      $%  [%make owner=@p name=@t space=path roles=(map @tas @tas) ships=(map @p @tas)]
          [%delete path=path]
          [%add to=path id=path type=@tas]
          [%remove from=path id=path]
          [%rename path=path name=@t]
          [%addperm path=path perm=@t level=@tas type=@tas]
          [%removeperm path=path item=path type=@tas]
          [%gatherall path=path]
          [%gather path=path peer=@p]
          [%delta path=path version=version]
          [%sync path=path update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
          [%request path=path peer=@p]
          [%answer path=path]
          [%populate path=path fold=folder]
      ==
    ==
    $:  %space
      $%  [%make space=path]
          [%addperm path=path perm=@t level=@tas type=@tas]
          [%removeperm path=path item=path type=@tas]
          [%gatherall space=path]
          [%gather space=path peer=@p]
          [%delta space=path version=version]
          [%sync space=path update=[roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
      ==
    ==
  ==
+$  update
  $%  [%init id=id settings=dsettings updates=(set dupdate)]
      [%update id=id update=dupdate]
  ==
--
