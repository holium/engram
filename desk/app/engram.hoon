/-  *engram
/-  membership
/-  index
/+  engram
/+  index
/+  default-agent, dbug, agentio
|%
+$  versioned-state
  $%  state-0
      state-1
      state-2
      state-3
      state-9
      state-10
      state-11
  ==
+$  state-0   [v=%0 t=localtime h=* s=* d=old-documents f=* u=*]
+$  state-1   [v=%1 t=localtime h=* s=* d=old-documents f=* u=*]
+$  state-2   [v=%2 t=localtime h=* s=* d=old-documents-2 f=* u=*]
+$  state-3   [v=%3 t=localtime h=* s=* d=old-documents-2 f=*]
+$  state-9   [v=%9 t=localtime h=history s=spaces-10 d=old-documents-2 f=folders-10]
+$  state-10  [v=%10 t=localtime h=history s=spaces-10 d=documents-10 f=folders-10]
+$  state-11  [v=%11 t=localtime h=history s=spaces d=documents f=folders]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-11
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/clock/json
  =/  clk
    ?.  .^(? %cu filepath)  ~&  "Initializing clock backup"  t
    ~&  "Loading clock backup:"
    %-  ni:dejs:format  !<  json  .^(vase %cr filepath)
  :_  this(t clk)
  :~  [%pass /engram/build-doc-desk %arvo %c [%merg %engram-docs our.bowl %base da+now.bowl %init]]
      [%pass /engram/save %arvo %c [%info %engram-docs %& [/clock/json %ins %json !>((numb:enjs:format clk))]~]]
  ==
::
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  =/  contents  %+  turn  ~(val by d.old)
          |=  doc=old-document
          =/  content  ^*(dcontent)
          =/  ncontent  (insert:index content (tape:enjs:format content.doc) our.bowl)
          [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id.doc)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
        =/  ndocs  %-  ~(run by d.old)  |=  doc=old-document  [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc ^*((index:index tape))]
        =/  freshstate  ^*(state-11)  
        =/  nstate
        =.  d.freshstate  ndocs
        freshstate
        :_  this(state nstate)  
          %+  weld
            ^-  (list card)  ~[[%pass /engram/build-doc-desk %arvo %c [%merg %engram-docs our.bowl %base da+now.bowl %init]]]
            ^-  (list card)  contents
    %1  =/  contents  %+  turn  ~(val by d.old)  
          |=  doc=old-document
          =/  content  ^*(dcontent)
          =/  ncontent  (insert:index content (tape:enjs:format content.doc) our.bowl)
          [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id.doc)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
        =/  ndocs  %-  ~(run by d.old)  |=  doc=old-document  [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc ^*((index:index tape))]
        =/  freshstate  ^*(state-11)  
        =/  nstate
        =.  d.freshstate  ndocs
        freshstate
        :_  this(state nstate)
          %+  weld
            ^-  (list card)  ~[[%pass /engram/build-doc-desk %arvo %c [%merg %engram-docs our.bowl %base da+now.bowl %init]]]
            ^-  (list card)  contents
    %2  =/  freshstate  ^*(state-11) 
        =/  nstate
        =/  ndocs  ^-  documents  %-  ~(run by d.old)  
          |=  doc=old-document-2
          [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc ^*((index:index tape))]
        =.  d.freshstate  ndocs
        freshstate
        `this(state nstate)
    %3  =/  freshstate  ^*(state-11)  
        =/  ndocs  ^-  documents  %-  ~(run by d.old)
          |=  doc=old-document-2  
          [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc ^*((index:index tape))]
        =/  nstate
        =.  d.freshstate  ndocs
        freshstate
        `this(state nstate)
    %9
        =/  nspaces  ^-  spaces  %-  ~(run by s.old)  |=  spc=space-10  [roles.spc content.spc]
        =/  ndocuments  ^-  documents  %-  ~(run by d.old)  |=  doc=old-document-2  ^-  document  [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc ^*((index:index tape))]
        =/  nfolders  ^-  folders  %-  ~(run by f.old)  |=  fol=folder-10  [id.fol owner.fol name.fol space.fol content.fol]
        `this(state [%11 t.old h.old nspaces ndocuments nfolders])
    %10
        =/  nspaces  ^-  spaces  %-  ~(run by s.old)  |=  spc=space-10  [roles.spc content.spc]
        =/  ndocuments  ^-  documents  %-  ~(run by d.old)  |=  doc=document-10  [id.doc version.doc [owner.settings.doc name.settings.doc space.settings.doc ships.settings.doc] snapshots.doc imgs.doc]
        =/  nfolders  ^-  folders  %-  ~(run by f.old)  |=  fol=folder-10  [id.fol owner.fol name.fol space.fol content.fol]
        `this(state [%11 t.old h.old nspaces ndocuments nfolders])
    %11
        =/  json-mark  .^(vase %cr /(scot %p our.bowl)/engram/(scot %da now.bowl)/mar/json/hoon)
        :_  this(state old)
        %+  weld
        ::[%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
          :~  ^-  card  [%pass /engram/update-json-mark %arvo %c [%info %engram-docs %& [/mar/json/hoon %ins %hoon json-mark]~]]
          ==
        %+  weld  
          %+  turn  ~(tap in ~(key by s.old))
          |=  space=path
          ^-  card
          [%pass /space/gatherall %agent [our.bowl %engram] %poke %post !>([%space %gatherall space])]
        %+  turn  ~(tap in ~(key by f.old))
        |=  fol=id
        ^-  card
        [%pass /folder/gatherall %agent [our.bowl %engram] %poke %post !>([%folder %gatherall /(scot %p -.fol)/(scot %ud +.fol)])]
  ==
::
++  on-poke
  |=  [=mark v=vase]
  ^-  (quip card _this)
    =/  act  !<(action v)
    ?-   -.act
      ::
      ::  Leave the update subscription
      ::
      %leave
        :_  this
        :~  [%give %kick ~[/updates] `src.bowl]
        ==
      %document
        ?-  -.+.act
        ::
        :: Initialize a new document with a blank document as passed by the frontend
        ::
          %make
        ?>  =(src.bowl our.bowl)
        =/  doc  :*  
          [our.bowl t]
          version.act
          :*  owner.act 
              name.act 
              space.act
              ^*  (index:index [@p @tas])
          ==
          ^*  (set dsnapshot)
          ^*  (index:index tape)
        ==
        ::
        =/  id  [our.bowl t]
        =/  state  this(d (~(put by d) id doc))
        =/  oldspc
        ?:  (~(has by s) space.act)
          (~(got by s) space.act)
        ^*  space
        =/  newspc
          =.  content.oldspc  (insert:index content.oldspc [id %document] our.bowl)
          oldspc
        =/  sstate  state(s (~(put by s) space.act newspc))
        =/  hstate  sstate(h (snoc h id))
        =/  content  ^*  (index:index json)
        =/  ncontent  (insert:index content (tape:enjs:format content.act) our.bowl)
        :_  hstate(t (add t 1))
        :~  [%pass /engram/save %arvo %c [%info %engram-docs %& [/clock/json %ins %json !>((numb:enjs:format (add t 1)))]~]]
            [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
            [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
        ==
        ::
        ::  Add an image to a document
        ::
          %addimg
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  ndoc
        =.  imgs.doc  (insert:index imgs.doc img.act our.bowl)
        doc
        :_  this(d (~(put by d) id ndoc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ==
        ::
        ::  quietly delete a document from state
        ::
          %softdelete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        :_  this(d (~(del by d) id))
        :~  [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %del ~]~]]
        ==
        ::
        ::  delete a document
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  copy  (~(got by d) id)
        =/  nstate  this(d (~(del by d) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %document])
            =/  spclist  ~(tap by content.content.spc) 
            =/  idx  (find ~[[id %document]] (turn spclist |=(a=[[@p @ud] [[@p @ud] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %document])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %document]] (turn fldrlist |=(a=[[@p @ud] [[@p @ud] @tas]] +.a)))
            =/  todel  (snag (need idx) fldrlist)
            =.  content.fldr  (remove:index content.fldr -.todel our.bowl)
            fldr
          fldr
        =/  fstate  sstate(f fldrs)
        :_  fstate
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.settings.copy])]
            [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %del ~]~]]
        ==
        ::
        :: modify a document by changing the stored document state
        ::
          %save
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
        ?.  .^(? %cu filepath)  ~&  "Document does not exist in clay :("  !!
        =/  content  %-  dejs:index  !<  json  .^(vase %cr filepath)
        =/  ncontent  (insert:index content (tape:enjs:format content.act) our.bowl)
        =/  old  (~(got by d) id)
        =/  p  /(scot %p our.bowl)/(scot %ud (~(got by version.ncontent) our.bowl))
        =/  new  
        =.  version.old    version.act
        old
        :_  this(d (~(put by d) id new))
        :~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
            [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
        ==
        ::
        ::
        ::
          %snap
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  old  (~(got by d) id)
        =/  new
        =.  snapshots.old  (~(put in snapshots.old) snapshot.act)
        old
        `this(d (~(put by d) id new))
        ::
        :: Rename a document
        ::
          %rename
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ~_  [%leaf "Error renaming document of id: {<id>}"]
        ?.  (~(has by d) id)
          ~&  "Could not find document!"  !!
        =/  old  (~(got by d) id)
        ?.  =(owner.settings.old our.bowl)
          ~&  "You do not have the right to rename this document!"  !!
        =/  new
        =.  name.settings.old  name.act
        old
        :_  this(d (~(put by d) id new))
        :~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ==
        ::
        :: Add a permission to a document
        ::
          %addperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  todoc  (~(got by d) id)
        =/  ndoc
          =.  ships.settings.todoc  (insert:index ships.settings.todoc [perm.act level.act] our.bowl)
          todoc
        :_  this(d (~(put by d) id ndoc))
        :~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ==
        ::
        :: Remove a permission rule
        ::
          %removeperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  item  [`@p`(slav %p -.item.act) (slav %ud -.+.item.act)]
        =/  ndoc
          =.  ships.settings.doc  (remove:index ships.settings.doc item our.bowl)
          doc
        :_  this(d (~(put by d) id ndoc))
        :~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ==
        ::
        ::  A helper poke to gather updates from everyone who has access to a document
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?:  =(space.settings.doc /null/space)  ~&  "Document does not belong to a space"  `this
        ?.  ?&((~(has by s) space.settings.doc) (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm))
          =/  directpeers  %+  turn  ~(val by content.ships.settings.doc)  |=  a=[@p @tas]  -.a
          :_  this
          %+  turn  (weld directpeers ~[owner.settings.doc])
            |=  peer=@p 
            [%pass /document/gather %agent [our.bowl %engram] %poke %post !>([%document %gather path.act peer])]
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.settings.doc -.+.space.settings.doc ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.settings.doc)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (online:engram [(weld directpeers spacepeers) our.bowl now.bowl])
            |=  peer=@p 
            [%pass /document/gather %agent [our.bowl %engram] %poke %post !>([%document %gather path.act peer])]
        ==
        ::
        ::  A Helper to send update notifs to everyone with access to a document
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ::~&  "Update All-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?.  ?&((~(has by s) space.settings.doc) (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm))
          =/  directpeers  %+  turn  ~(val by content.ships.settings.doc)  |=  a=[@p @tas]  -.a
          :_  this
          %+  turn  (weld directpeers ~[owner.settings.doc])
            |=  peer=@p 
            [%pass /document/update %agent [peer %engram] %poke %post !>([%document %update path.act])]
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.settings.doc -.+.space.settings.doc ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.settings.doc)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (weld (weld directpeers spacepeers) ~[owner.settings.doc])
            |=  peer=@p 
            [%pass /document/update %agent [peer %engram] %poke %post !>([%document %update path.act])]
        ==
        ::
        ::  Poked when a remote update is availible
        ::
          %update
        :_  this
        :~  [%pass /document/gather %agent [our.bowl %engram] %poke %post !>([%document %gather path.act src.bowl])]
        ==
        ::
        ::  Gather updates to a document from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?:  =(our.bowl peer.act)
          `this
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?.  (~(has by d) id)
          :: If we do not have this document request it
          :_  this
          :~  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %request path.act peer.act])]
          ==
        :: retrieve content to check version
        =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
        ?.  .^(? %cu filepath)  ~&  "<engram>: document does not yet exist on system"  !!
        =/  content  %-  dejs:index  !<  json  .^(vase %cr filepath)
        :_  this
        :~  [%pass /engram/delta %agent [peer.act %engram] %poke %post !>([%document %delta path.act version.content])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ?:  =(src.bowl our.bowl)  `this
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ::  get metadata
        ?.  (~(has by d) id)  ~&  "<engram>: {<our.bowl>} does not know about document {<path.act>} yet"  `this
        =/  doc  (~(got by d) id)
        :: get content
        =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
        ?.  .^(? %cu filepath)  ~&  "<engram>: document does not yet exist on system"  !!
        =/  content  %-  dejs:index  !<  json  .^(vase %cr filepath)
        ::  assemble update
        =/  updates  ?:  =(version.content version.act)  
          ~&  "<engram>: peer is up to date"  ^*  (update:index json)
        (delta:index content version.act)
        =/  ships  (delta:index ships.settings.doc ^*(version:index))
        =/  imgs   (delta:index imgs.doc ^*(version:index))
        =/  payload  [name.settings.doc ships imgs updates]
        :_  this
        :~  [%pass /engram/delta %agent [src.bowl %engram] %poke %post !>([%document %sync path.act payload])]
        ==
        ::
        ::  Sync updates with current document
        ::
          %sync
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ::  Metadata Changes
        =/  doc  (~(got by d) id)
        :: Content Changes
        =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
        ?.  .^(? %cu filepath)  ~&  "<engram>: document does not yet exist on system"  !!
        =/  content  %-  dejs:index  !<  json  .^(vase %cr filepath)
        =/  ncontent  (apply:index content content.update.act)
        =/  ndoc
          =:  name.settings.doc   name.update.act
              ships.settings.doc  (apply:index ships.settings.doc ships.update.act)
              imgs.doc            (apply:index imgs.doc imgs.update.act)
            ==
          doc
        :_  this(d (~(put by d) id ndoc))
        :~  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.settings.doc)] ['type' (tape:enjs:format "document")] ['id' (path:enjs:format path.act)]]))]
            [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %ins %json !>((enjs:index ncontent))]~]]
        ==
        ::
        :: Request a document you don't have
        ::
          %request
        ?>  =(src.bowl our.bowl)
        :_  this
        :~  [%pass /document/answer %agent [peer.act %engram] %poke %post !>([%document %answer path.act])]
        ==
        :: 
        :: Answer a request for a document
        ::
          %answer
        ::~&  "Request from: {<src.bowl>}"
        ?:  =(src.bowl our.bowl)  `this
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?.  (~(has by d) id)  ~&  "<engram>: {<our.bowl>} does not know about document {<path.act>} yet"  `this
        =/  doc  (~(got by d) id)
        =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
        ?.  .^(? %cu filepath)  ~&  "<engram>: {<our.bowl>} does not exist in clay :("  !!
        =/  content  !<  json  .^(vase %cr filepath)
        :_  this
        :~  [%pass /document/populate %agent [src.bowl %engram] %poke %post !>([%document %populate path.act doc content])]
        ==
        ::
        :: Populate a requested document
        ::
          %populate
        ~&  "running populate"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        :_  this(d (~(put by d) id doc.act))
        :~  [%pass /engram/save %arvo %c [%info %engram-docs %& [`path`~[(crip (pathify:index id)) ~.json] %ins %json !>(content.act)]~]]
            [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.settings.doc.act)] ['type' (tape:enjs:format "space")] ['id' (path:enjs:format space.settings.doc.act)]]))]
        ==
      ==
      %folder
        ?-  -.+.act
        ::
        :: Create a new folder
        ::
          %make
        ?>  =(src.bowl our.bowl)
        =/  fold  :*  
          [our.bowl t]
          owner.act
          name.act
          space.act
          ^*  (index:index [id @tas])
        ==
        =/  id  [our.bowl t]
        =/  fstate  this(f (~(put by f) id fold))
        =/  oldspc
        ?:  (~(has by s) space.act)
          (~(got by s) space.act)
        =/  initspc  ^*  space
        =.  roles.initspc  (insert:index roles.initspc ^-([@tas @tas] [%member %editor]) our.bowl)
        initspc
        =/  newspc
        =.  content.oldspc  (insert:index content.oldspc [id %folder] our.bowl)
          oldspc
        =/  sstate  fstate(s (~(put by s) space.act newspc))
        =/  hstate  sstate(h (snoc h id))
        :_  hstate(t (add t 1))
        :~  [%pass /engram/save %arvo %c [%info %engram-docs %& [/clock/json %ins %json !>((numb:enjs:format (add t 1)))]~]]
            [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        :: quietly delete a folder from state
        ::
          %softdelete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        `this(f (~(del by f) id))
        ::
        :: delete an existing folder
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?>  (~(has by f) id)
        =/  copy  (~(got by f) id)
        =/  nstate  this(f (~(del by f) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %folder])
            =/  spclist  ~(tap by content.content.spc) 
            =/  idx  (find ~[[id %folder]] (turn spclist |=(a=[[@p @ud] [[@p @ud] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %folder])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %folder]] (turn fldrlist |=(a=[[@p @ud] [[@p @ud] @tas]] +.a)))
            =/  todel  (snag (need idx) fldrlist)
            =.  content.fldr  (remove:index content.fldr -.todel our.bowl)
            fldr
          fldr
        =/  fstate  sstate(f fldrs)
        :_  fstate
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.copy])]
        ==
        ::
        :: add a document or folder to another folder
        ::
          %add
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.id.act) (slav %ud -.+.id.act)]
        =/  to  [`@p`(slav %p -.to.act) (slav %ud -.+.to.act)]
        ?>  (~(has by f) to)
        =/  tofldr  (~(got by f) to)
        =/  nfldr
        =.  content.tofldr  (insert:index content.tofldr [id type.act] our.bowl)
        tofldr
        :_  this(f (~(put by f) to nfldr))
        :~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall to.act])]
        ==
        ::
        :: remove a document or folder from a folder
        ::
          %remove
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.id.act) (slav %ud -.+.id.act)]
        =/  from  [`@p`(slav %p -.from.act) (slav %ud -.+.from.act)]
        ?>  (~(has by f) from)
        =/  fromfldr  (~(got by f) from)
        =/  nfldr
        =.  content.fromfldr  (remove:index content.fromfldr id our.bowl)
        fromfldr
        :_  this(f (~(put by f) from nfldr))
        :~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall from.act])]
        ==
        ::
        :: Rename a folder
        ::
          %rename
        ?>  =(src.bowl our.bowl)

        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ~_  [%leaf "Error renaming folder of id: {<id>}"]
        ?.  (~(has by f) id)
          ~&  "Could not find folder!"  !!
        =/  old  (~(got by f) id)
        ?.  =(owner.old our.bowl)
          ~&  "You do not have the right to rename this folder!"  !!
        =/  new
        =.  name.old  name.act
        old
        :_  this(f (~(put by f) id new))
        :~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall path.act])]
        ==
        ::
        ::  Gather updated to a folder index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- items in {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        =/  peers
          ?.  (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm)  ^*  (list @p)
          =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.fold -.+.space.fold ~.members ~.noun])
          ?+  -.spacemembers  !!
              %members
            =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
            spacepeers
          ==
        :_  this
          %+  turn  (online:engram [peers our.bowl now.bowl])
            |=  peer=@p
            [%pass /engram/folder/gather %agent [our.bowl %engram] %poke %post !>([%folder %gather path.act peer])]
        ::
        ::  A Helper to send update notifs to everyone with access to a folder
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        =/  peers
          ?.  (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm)  ^*  (list @p)
          =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.fold -.+.space.fold ~.members ~.noun])
          ?+  -.spacemembers  !!
              %members
            =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
            spacepeers
          ==
        :_  this
          %+  turn  (weld peers ~[owner.fold])
            |=  peer=@p
            [%pass /folder/update %agent [peer %engram] %poke %post !>([%folder %update path.act])]
        ::
        ::  Poked when a remote update is availible
        ::
          %update
        ::~&  "Update msg from {<src.bowl>}"
        :_  this
        :~  [%pass /folder/gather %agent [our.bowl %engram] %poke %post !>([%folder %gather path.act src.bowl])]
        ==
        ::
        ::  Gather updates to a folder from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?.  !=(our.bowl peer.act)
          `this
        ::~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?.  (~(has by f) id)
          :: If we do not have this folder request it
          :_  this
          :~  [%pass /folder/request %agent [our.bowl %engram] %poke %post !>([%folder %request path.act peer.act])]
          ==
        =/  fol  (~(got by f) id)
        :_  this
        :~  [%pass /engram/folder %agent [peer.act %engram] %poke %post !>([%folder %delta path.act version.content.fol])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        ?:  =(src.bowl our.bowl)  `this
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?.  (~(has by f) id)  ~&  "<engram>: {<our.bowl>} does not know about folder {<path.act>} yet"  `this
        =/  fol  (~(got by f) id)
        =/  tid  `@ta`(cat 4 (cat 2 'folder-delta-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-folder !>([path.act src.bowl fol version.act])]
        :_  this
        :~
          [%pass /engram/delta/folder/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/delta/folder/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Sync updates with current folder
        ::
          %sync
        ::~&  "SYNC-- from {<src.bowl>} for {<path.act>}: "
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        =/  fol  (~(got by f) id)
        =/  tid  `@ta`(cat 4 (cat 2 'folder-sync-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %sync-folder !>([path.act src.bowl fol update.act])]
        :_  this
        :~  
          [%pass /engram/sync/folder/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/sync/folder/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        :: Request a folder you don't have
        ::
          %request
        ?>  =(src.bowl our.bowl)
        :_  this
        :~  [%pass /folder/answer %agent [peer.act %engram] %poke %post !>([%folder %answer path.act])]
        ==
        :: 
        :: Answer a request for a folder
        ::
          %answer
        ?:  =(src.bowl our.bowl)  `this
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        ?.  (~(has by f) id)  ~&  "<engram>: {<our.bowl>} does not know about folder {<path.act>} yet"  `this
        =/  fold  (~(got by f) id)
        ::?>  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        :_  this
        :~  [%pass /folder/populate %agent [src.bowl %engram] %poke %post !>([%folder %populate path.act fold])]
        ==
        ::
        :: Populate a requested document
        ::
          %populate
        =/  id  [`@p`(slav %p -.path.act) (slav %ud -.+.path.act)]
        :_  this(f (~(put by f) id fold.act))
        :~  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['type' (tape:enjs:format "space")] ['id' (path:enjs:format space.fold.act)]]))]
        ==
      ==
      %space
        ?-  -.+.act
        ::
        :: Initialize a new space index
        ::
          %make
        ?>  =(src.bowl our.bowl)
        =/  initspc  ^*  space
        =/  adminroles   (insert:index roles.initspc ^-([@tas @tas] [%admin %admin]) our.bowl)
        =/  memberroles  (insert:index adminroles ^-([@tas @tas] [%member %editor]) our.bowl)
        =/  viewerroles  (insert:index memberroles ^-([@tas @tas] [%initiate %viewer]) our.bowl)
        =/  spc
        ?:  =(our.bowl (slav %p -.space.act))
          =.  roles.initspc  viewerroles
          initspc
        initspc
        `this(s (~(put by s) space.act spc))
        ::
        :: Change the permission of a document
        ::
          %exchange-role
        ?>  =(src.bowl our.bowl)
        =/  spc  (~(got by s) space.act)
        =/  id  [`@p`(slav %p -.item.act) (slav %ud -.+.item.act)]
        =/  perm  (~(got by content.roles.spc) id)
        =/  removed  (remove:index roles.spc id our.bowl)
        =/  inserted  (insert:index removed [-.perm level.act] our.bowl)
        =/  nspc
          =.  roles.spc  inserted
          spc
        :_  this(s (~(put by s) space.act nspc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        :: Add a permission rule
          %addperm
        ?>  =(src.bowl our.bowl)
        =/  tospc  (~(got by s) space.act)
        =/  nspc
          =.  roles.tospc  (insert:index roles.tospc [(slav %tas perm.act) level.act] our.bowl)
          tospc
        :_  this(s (~(put by s) space.act nspc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        
        ::
        :: Remove a permission rule
        ::
          %removeperm
        ?>  =(src.bowl our.bowl)
        =/  spc  (~(got by s) space.act)
        =/  id  [`@p`(slav %p -.item.act) (slav %ud -.+.item.act)]
        =/  nspc
          =.  roles.spc  (remove:index roles.spc id our.bowl)
          spc
        :_  this(s (~(put by s) space.act nspc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        ::  Gather updated to a space index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ?.  (~(has by s) space.act)  ~&  "No space at this path"  `this
        =/  spc  (~(got by s) space.act)
        =/  peers
          ?.  (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm)
            ^*  (list @p)
          =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.act -.+.space.act ~.members ~.noun])
          ?+  -.spacemembers  !!
              %members
            =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
            spacepeers
          ==
        :_  this
          %+  turn  (online:engram [peers our.bowl now.bowl])
            |=  peer=@p
            [%pass /engram/space/gather %agent [our.bowl %engram] %poke %post !>([%space %gather space.act peer])]
        ::
        ::  A Helper to send update notifs to everyone with access to a space
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ?.  (~(has by s) space.act)  ~&  "No space at this path"  `this
        =/  spc  (~(got by s) space.act)
        =/  peers
          ?.  (~(has in .^((set desk) %cd /(scot %p our.bowl)/base/(scot %da now.bowl))) %realm)
            ^*  (list @p)
          =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.act -.+.space.act ~.members ~.noun])
          ?+  -.spacemembers  !!
              %members
            =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
            spacepeers
          ==
        :_  this
          %+  turn  peers
            |=  peer=@p
            [%pass /space/update %agent [peer %engram] %poke %post !>([%space %update space.act])]
        ::
        ::  Poked when a remote update is availible
        ::
          %update
        :_  this
        :~  [%pass /space/gather %agent [our.bowl %engram] %poke %post !>([%space %gather space.act src.bowl])]
        ==
        ::
        ::  Gather updates to a space from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?.  !=(our.bowl peer.act)
          `this
        =/  spc  (~(got by s) space.act)
        :_  this
        :~  [%pass /engram/space %agent [peer.act %engram] %poke %post !>([%space %delta space.act version.content.spc])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ?:  =(src.bowl our.bowl)  `this
        ?.  (~(has by s) space.act)  ~&  "<engram>: {<our.bowl>} does not know about space {<space.act>} yet"  `this
        =/  spc  (~(got by s) space.act)
        =/  tid  `@ta`(cat 4 (cat 2 'space-delta-' -.+.space.act) (cat 2 -.space.act (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-space !>([space.act src.bowl spc version.act])]
        :_  this
        :~
          [%pass /engram/delta/space/[(cat 2 (scot %p -.+.space.act) (scot %ud -.space.act))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/delta/space/[(cat 2 (scot %p -.+.space.act) (scot %ud -.space.act))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Sync updates with current space
        ::
          %sync
        =/  spc  (~(got by s) space.act)
        =/  tid  `@ta`(cat 4 (cat 2 'space-sync-' -.+.space.act) (cat 2 -.space.act (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %sync-space !>([space.act src.bowl spc update.act])]
        :_  this
        :~  
          [%pass /engram/sync/space/[(cat 2 (scot %p -.+.space.act) (scot %ud -.space.act))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/sync/space/[(cat 2 (scot %p -.+.space.act) (scot %ud -.space.act))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
      ==
==
++  on-watch
  |=  p=path
  ^-  (quip card _this)
  ?+  p  (on-watch:def p)
    [%updates ~]  `this
    [%preview @ @ ~]  
    =/  id=id  [`@p`(slav %p i.t.p) (slav %ud i.t.t.p)]
    =/  doc  (~(got by d) id)
    :_  this
    :~  [%give %fact ~ %json !>((get:document:enjs:engram doc))]
    ==
  ==
++  on-leave  on-leave:def
++  on-peek
  |=  p=path
  ^-  (unit (unit cage))
  ?+    p  (on-peek:def p)
      [%x %history ~]
    ?>  =(src.bowl our.bowl)
    ~_  [%leaf "empty history"]
    ``noun+!>((timestamp:enjs:engram (rear h)))
    ::
      [%x %space @ @ %content ~]
    ?>  =(src.bowl our.bowl)
    ?:  (~(has by s) ~[i.t.t.p i.t.t.t.p])
      =/  spc  (~(got by s) ~[i.t.t.p i.t.t.t.p])
      ``noun+!>((content:space:enjs:engram [d f content.content.spc]))
    ~&  "No space of path: {<`path`~[i.t.t.p i.t.t.t.p]>}"
    ``noun+!>((tape:enjs:format "Missing Space"))
    ::
      [%x %space @ @ %list ~]
    ?>  =(src.bowl our.bowl)
    ?:  (~(has by s) ~[i.t.t.p i.t.t.t.p])
      =/  spc  (~(got by s) ~[i.t.t.p i.t.t.t.p])
      ``noun+!>((list:space:enjs:engram spc))
    ~&  "No space of path: {<`path`~[i.t.t.p i.t.t.t.p]>}"
    ``noun+!>((tape:enjs:format "Missing Space"))
    ::
      [%x %space @ @ %perms ~]
    ?:  (~(has by s) ~[i.t.t.p i.t.t.t.p])
      =/  spc  (~(got by s) ~[i.t.t.p i.t.t.t.p])
      ``noun+!>((perms:space:enjs:engram spc))
    ~&  "No space of path: {<`path`~[i.t.t.p i.t.t.t.p]>}"  !!
    ::
      [%x %document %list ~]
    ``noun+!>((listall:document:enjs:engram d))
  ::
      [%x %document @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    ?.  (~(has by d) id)
      ``noun+!>((tape:enjs:format "missing document"))
    =/  doc  (~(got by d) id)
    ``noun+!>((get:document:enjs:engram doc))
  ::
      [%x %document @ @ %meta ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    ?.  (~(has by d) id)
      ``noun+!>((tape:enjs:format "missing document"))
    =/  doc  (~(got by d) id)
    ``noun+!>((meta:document:enjs:engram doc))
  ::
      [%x %document @ @ %perms ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((perms:document:enjs:engram settings.doc))
  ::
      [%x %document @ @ %snapshots ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((snapshots:document:enjs:engram snapshots.doc))
  ::
      [%x %document @ @ %content ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    =/  filepath  /(scot %p our.bowl)/engram-docs/(scot %da now.bowl)/(crip (pathify:index id))/json
    ?.  .^(? %cu filepath)  ~&  "Document does not exist in clay :("  !!
    =/  content  %-  dejs:index  !<  json  .^(vase %cr filepath)
    ``noun+!>((content:document:enjs:engram [doc content]))
      [%x %document @ @ %version ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((tape:enjs:format version.doc))
      [%x %document @ @ %images ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((images:document:enjs:engram imgs.doc))
  ::
      [%x %folder @ @ %list ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((list:folder:enjs:engram fold))
  ::
      [%x %folder @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((list:folder:enjs:engram fold))
  ::
      [%x %folder @ @ %meta ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) (slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((meta:folder:enjs:engram fold))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ?+    -.wire  (on-agent:def wire sign)
        %engram
        ::~&  "Request on wire: {<wire>} with sign {<-.sign>}"
      ?+    -.sign  (on-agent:def wire sign)
          %watch-ack
        ?~  p.sign
          ::((slog '%engram: Subscribe succeeded!' ~) `this)
          `this
        ((slog '%engram: Subscribe failed!' ~) `this)
      ::
          %kick
        `this
      ::
          %fact
        ::~&  "Request to fact with marL {<p.cage.sign>}"
        ?+    p.cage.sign  (on-agent:def wire sign)
            %noun
          `this
            %thread-fail
          =/  err  !<  (pair term tang)  q.cage.sign
          %-  (slog leaf+"Thread failed: {(trip p.err)}" q.err)
          `this
            %thread-done
          =/  res  !<(thread-res q.cage.sign)
          ::~&  "Thread Result: {<-.res>}"
          ?+  -.res  ~&  "Bad thread result"  !!
              %gather-folder-success  `this
              %delta-folder-success   `this
              %sync-folder-success
            =/  id  [`@p`(slav %p -.path.res) (slav %ud -.+.path.res)]   
            =/  fol  (~(got by f) id)
            ::  Folder Changes
            =/  nfol
              =:  name.fol  name.update.res
                  content.fol  (apply:index content.fol content.update.res)
                ==
              fol
            ::~&  "--- Sunk Folder :) ---"  
            ~&  "<engram>: sync folder {<path.res>}"
            :_  this(f (~(put by f) id nfol))
            :~  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.fol)] ['type' (tape:enjs:format "folder")] ['id' (path:enjs:format path.res)]]))]
            ==
            ::
              %gather-space-success  `this
              %delta-space-success   `this
              %sync-space-success
            =/  spc  (~(got by s) space.res)
            ::  Space Changes
            =/  nspc
            =:  roles.spc  (apply:index roles.spc roles.update.res)
                content.spc  (apply:index content.spc content.update.res)
              ==
            spc
            =/  diffget  (~(dif by content.content.nspc) content.content.spc)
            =/  diffdel  (~(dif by content.content.spc) content.content.nspc)
            =/  sstate  this(s (~(put by s) space.res nspc))
            ::~&  "--- Sunk Space :) ---" 
            ~&  "<engram>: sync space {<space.res>}"
            :_  sstate
              %+  snoc  
                %+  weld
                  %+  turn  ~(tap by diffdel)
                  |=  item=[id [id @tas]]
                  ^-  card
                  ?+  +.+.item  !!
                    %document  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %softdelete `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~]])]
                    %folder    [%pass /folder/request %agent [our.bowl %engram] %poke %post !>([%folder %softdelete `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~]])]
                  ==
                  %+  turn  ~(tap by diffget)
                  |=  item=[id [id @tas]]
                  ^-  card
                  ?+  +.+.item  !!
                    %document  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.+.item])]
                    %folder    [%pass /folder/request %agent [our.bowl %engram] %poke %post !>([%folder %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.item])]
                  ==
              ^-  card  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.res)] ['type' (tape:enjs:format "space")] ['id' (path:enjs:format space.res)]]))]
          ==
            %update
          =/  msg  !<  tape  q.cage.sign
          %-  (slog leaf+msg ~)
          `this
      ==
    ==
  ==
++  on-arvo
  |=  [=wire =sign-arvo]
  ?+  -.sign-arvo  ~|  "unexpected system response {<-.sign-arvo>} to {<dap.bowl>} on wire {<wire>}"  !!
      %clay
    ?+  -.+.sign-arvo  ~|  "unexpected system response {<-.sign-arvo>} to {<dap.bowl>} on wire {<wire>}"  !!
        %mere
      ?:  -.+.+.sign-arvo
        ~&  "<engram>: set up storage desk"  `this
      ~&  "<engram>: skipping storage desk setup"  `this
    ==
  ==
++  on-fail   
  |=  [=term =tang]
  ~&  "Fail with term {<term>}"
  (on-fail:def term tang)
--
