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
::
::  Organisms
::  Documents
+$  dversion   tape
+$  dcontent   (index json)
+$  dsettings  [owner=@p name=@t space=path roles=(index [@tas @tas]) ships=(index [@p @tas])]
+$  dsnapshot  [timestamp=@da author=@p data=tape]
::+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion settings=dsettings snapshots=(set dsnapshot)]
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
::+$  updates  (map id (map @p dupdate))
+$  documents  (map id document)
+$  folders  (map id folder)
::
+$  old-update     [author=@p timestamp=@da content=tape]
+$  old-updates    (map id (map @p old-update))
+$  old-document   [id=id version=dversion content=tape settings=dsettings snapshots=(set dsnapshot)]
+$  old-documents  (map id:index old-document)
::
+$  old-update-2     [author=@p timestamp=@da content=tape]
+$  old-updates-2    (map id (map @p old-update))
+$  old-document-2   [id=id version=dversion settings=dsettings snapshots=(set dsnapshot)]
+$  old-documents-2  (map id:index old-document)
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
    [%leave self=@p]
    $:  %document
      $%  [%make owner=@p name=@t space=path version=dversion content=tape roles=(map @tas @tas) ships=(map @p @tas)]
          [%softdelete path=path]
          [%delete path=path]
          [%save path=path content=tape version=dversion]
          [%snap path=path snapshot=dsnapshot]
          [%rename path=path name=@t]
          [%addperm path=path perm=@t level=@tas type=@tas]
          [%removeperm path=path item=path type=@tas]
          [%gatherall path=path]
          [%updateall path=path]
          [%update path=path]
          [%gather path=path peer=@p]
          [%delta path=path version=version]
          [%sync path=path update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index json)]]
          [%request path=path peer=@p]
          [%answer path=path]
          [%populate path=path doc=document content=json]
          ::[%accept path=path]
      ==
    ==
    $:  %folder
      $%  [%make owner=@p name=@t space=path roles=(map @tas @tas) ships=(map @p @tas)]
          [%softdelete path=path]
          [%delete path=path]
          [%add to=path id=path type=@tas]
          [%remove from=path id=path]
          [%rename path=path name=@t]
          [%addperm path=path perm=@t level=@tas type=@tas]
          [%removeperm path=path item=path type=@tas]
          [%gatherall path=path]
          [%updateall path=path]
          [%update path=path]
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
          [%addperm space=path perm=@t level=@tas type=@tas]
          [%removeperm space=path item=path type=@tas]
          [%gatherall space=path]
          [%updateall space=path]
          [%update space=path]
          [%gather space=path peer=@p]
          [%delta space=path version=version]
          [%sync space=path update=[roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
      ==
    ==
  ==
::+$  dthread-gather  [path=path peer=@p doc=document]
::+$  dthread-delta   [path=path src=@p doc=document content=json check-space=$?(%.y %.n)]
::+$  dthread-sync    [path=path peer=@p settings=dsettings update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(set dupdate)] check-space=$?(%.y %.n)]
+$  fthread-gather  [path=path peer=@p fol=folder]
+$  fthread-delta   [path=path src=@p fol=folder version=version]
+$  fthread-sync    [path=path peer=@p fol=folder update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
+$  sthread-gather  [space=path peer=@p spc=space]
+$  sthread-delta   [space=path src=@p spc=space version=version]
+$  sthread-sync    [space=path peer=@p spc=space update=[roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
+$  thread-res
  $%  [%none ~]
::      [%gather-document-success ~]
::      [%delta-document-success ~]
::      [%sync-document-success path=path peer=@p update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(list dupdate)]]
      [%gather-folder-success ~]
      [%delta-folder-success ~]
      [%sync-folder-success path=path peer=@p update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
      [%gather-space-success ~]
      [%delta-space-success ~]
      [%sync-space-success space=path peer=@p update=[roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
  ==
--
