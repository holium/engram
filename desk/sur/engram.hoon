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
+$  dsettings  [owner=@p name=@t roles=(index [@tas @tas]) ships=(index [@p @tas])]
+$  dsnapshot  [timestamp=@da author=@p data=tape]
+$  dupdate    [author=@p timestamp=@da content=dcontent]
+$  document   [id=id version=dversion content=dcontent settings=dsettings snapshots=(set dsnapshot)]
::
::  Folders
+$  folder  [id=id owner=@p name=@t roles=(index [@tas @tas]) ships=(index [@p @tas]) content=(index [id @tas])]
::
::  Spaces
+$  spath  path
+$  space  [roles=(index @tas @tas) ships=(index [@p @tas]) content=(index [id @tas])]

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
          [%addship path=path ship=@p level=@tas]
          [%addrole path=path role=@tas level=@tas]
          ::[%settings path=path owner=@p name=@ta roles=(map @tas @tas) ships=(map @p @tas)]
          [%gatherall path=path]
          [%gather path=path peer=@p]
          [%delta path=path]
          [%sync path=path updates=(set dupdate)]
          ::[%accept path=path update=dupdate]
      ==
    ==
    $:  %folder
      $%  [%make owner=@p name=@t space=path roles=(map @tas @tas) ships=(map @p @tas)]
          [%delete path=path]
          [%add to=path id=path type=@tas]
          [%remove from=path id=path]
          [%rename path=path name=@t]
          ::[%gatherall path=path]
          ::[%gather path=path peer=@p]
          ::[%sync path=path update=(update:index [id type])]
      ==
    ==
    ::$:  %space
    ::  $%  [%gatherall path=path]
    ::      [%gather space=path peer=@p]
    ::      [%sync space=path update=(update:index [id type])]
    ::  Propogation will occur in three (ish) steps: 
    ::    [spanning]      - across a space
    ::    the gatherall   - a routing poke that sends gather for all the peers in a space
    ::    the gather      - a poke is sent requesting updates from a peer for all the items indexed in a space 
    ::    the sync        - a poke is send with updates for all items
    ::    [specific]      - unique to an organism
    ::    the gatherall   - a routing poke that sends gather for all the peers in a space
    ::    the gather      - a poke is sent requesting updates from a peer, in the form of a sync poke
    ::    the sync        - a poke is sent with updates; syncs may also be sent without request in the case of realtime updates
    ::  ==
    ::==
    ::$:  %span
    ::  $%  [%gatherall path=path]
    ::      [%gather space=path]
    ::      [%sync space=path space=(update:index [id type]) folders=(map id (update:index [id type])) documents=(jug id dupdate)]
          ::
          ::[%sub path=path to=@p]
          ::[%unsub from=@p]
          ::
          ::[%update-live path=path update=dupdate]
    ::  ==
    ::==
  ==
+$  update
  $%  [%init id=id settings=dsettings updates=(set dupdate)]
      [%update id=id update=dupdate]
  ==
--
