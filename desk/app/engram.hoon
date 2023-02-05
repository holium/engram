/-  *engram
/-  membership
/-  index
/+  engram
/+  index
/+  default-agent, dbug, agentio
:: Notes on how to do access control
:: Updates are sent to the entire space plus ships
:: When added via ship there's no way to find it EXCEPT through search or link
:: -> first search requests if not exists
:: -> in the front end will need to hide the space when viewing a document added via-ship
:: -> removing or changing a ship MUST PUSH TO THAT SHIP so they know to hide themselves
:: When hidden in a space (you are in a space but do not have permission to view it)
:: -> documents are hidden in the front end
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 t=localtime h=history s=spaces d=documents f=folders u=updates]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this
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
    %0  :_  this(state old)
        %+  weld
          %+  weld  
            %+  turn  ~(tap in ~(key by s.old))
            |=  space=path
            [%pass /space/gatherall %agent [our.bowl %engram] %poke %post !>([%space %gatherall space])]
          %+  turn  ~(tap in ~(key by f.old))
          |=  fol=id
          [%pass /folder/gatherall %agent [our.bowl %engram] %poke %post !>([%folder %gatherall /(scot %p -.fol)/(scot %ud +.fol)])]
        %+  turn  ~(tap in ~(key by d.old))
        |=  doc=id
        [%pass /document/gatherall %agent [our.bowl %engram] %poke %post !>([%document %gatherall /(scot %p -.doc)/(scot %ud +.doc)])]
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
    =/  act  !<(action vase)
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
        :: initialize a new document with a blank document as passed by the frontend
        ::
          %make
        ?>  =(src.bowl our.bowl)
        =/  doc  :*  
          [our.bowl t]
          version.act
          content.act
          :*  owner.act 
              name.act 
              space.act
              ^*  (index:index [@tas @tas])
              ^*  (index:index [@p @tas])
          ==
          (silt `(list dsnapshot)`[~])
        ==
        ::
        =/  id  [our.bowl t]
        =/  state  this(d (~(put by d) id doc))
        =/  oldspc
        ?:  (~(has by s) space.act)
          (~(got by s) space.act)
        =/  initspc  ^*  space
        =.  roles.initspc  (insert:index roles.initspc ^-([@tas @tas] [%member %editor]) our.bowl)
        initspc
        =/  newspc
        =.  content.oldspc  (insert:index content.oldspc [id %document] our.bowl)
          oldspc
        =/  sstate  state(s (~(put by s) space.act newspc))
        =/  hstate  sstate(h (snoc h id))
        :_  hstate(t (add t 1))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        ::
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  copy  (~(got by d) id)
        =/  nstate  this(d (~(del by d) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %document])
            =/  spclist  ~(tap by content.content.spc) 
            =/  idx  (find ~[[id %document]] (turn spclist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %document])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %document]] (turn fldrlist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) fldrlist)
            =.  content.fldr  (remove:index content.fldr -.todel our.bowl)
            fldr
          fldr
        =/  fstate  sstate(f fldrs)
        :_  fstate
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.settings.copy])]
        ==
        ::
        :: modify a document by changing the stored document state
        ::
          %save
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  old  (~(got by d) id)
        =/  new  
        =:  content.old  content.act
            version.old  version.act
          ==
        old
        :_  this(d (~(put by d) id new))
        :~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ~_  [%leaf "Error renaming document of id: {<id>}"]
        ?.  (~(has by d) id)
          ~&  "Could not find document!"  !!
        =/  old  (~(got by d) id)
        ?.  =(owner.settings.old our.bowl)
          ~&  "You do not have the right to rename this document!"  !!
        =/  new
        =.  name.settings.old  name.act
        old
        `this(d (~(put by d) id new))
        :::_  this(d (~(put by d) id new))
        :::~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ::==
        ::
        :: Remove an update for the set of stored updates
        ::
          %accept
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        `this(u (~(del by u) id))
        ::
        :: Add a permission to a document
        ::
          %addperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  todoc  (~(got by d) id)
        =/  ndoc
        ?+  type.act  !!
            %ships
          =.  ships.settings.todoc  (insert:index ships.settings.todoc [(slav %p perm.act) level.act] our.bowl)
          todoc
            %roles
          =.  roles.settings.todoc  (insert:index roles.settings.todoc [(slav %tas perm.act) level.act] our.bowl)
          todoc
        ==
        `this(d (~(put by d) id ndoc))
        :::_  this(d (~(put by d) id ndoc))
        :::~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ::==
        ::
        :: Remove a permission rule
        ::
          %removeperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  item  [`@p`(slav %p -.item.act) `@u`(slav %ud -.+.item.act)]
        =/  ndoc
        ?+  type.act  !!
            %roles
          =.  roles.settings.doc  (remove:index roles.settings.doc item our.bowl)
          doc
            %ships
          =.  ships.settings.doc  (remove:index ships.settings.doc item our.bowl)
          doc
        ==
        `this(d (~(put by d) id ndoc))
        :::_  this(d (~(put by d) id ndoc))
        :::~  [%pass /document/updateall %agent [our.bowl %engram] %poke %post !>([%document %updateall path.act])]
        ::==
        ::
        ::  A helper poke to gather updates from everyone who has access to a document
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?:  =(space.settings.doc /null/space)  ~&  "Document does not belong to a space"  `this
        ?.  (~(has by s) space.settings.doc)
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
          %+  turn  (weld directpeers spacepeers)
            |=  peer=@p 
            [%pass /document/gather %agent [our.bowl %engram] %poke %post !>([%document %gather path.act peer])]
        ==
        ::
        ::  A Helper to send update notifs to everyone with access to a document
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ::~&  "Update All-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?:  =(space.settings.doc /null/space)  ~&  "Document does not belong to a space"  `this
        ?.  (~(has by s) space.settings.doc)
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
        ~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by d) id)
          :: If we do not have this document request it
          :_  this
          :~  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %request path.act peer.act])]
          ==
        =/  doc  (~(got by d) id)
        :_  this
        :~  [%pass /engram/delta %agent [peer.act %engram] %poke %post !>([%document %delta path.act])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        ?:  =(src.bowl our.bowl)  `this
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by d) id)  ~&  "{<our.bowl>} does not know about {<path.act>} yet"  `this
        =/  doc  (~(got by d) id)
        =/  tid  `@ta`(cat 4 (cat 2 'document-delta-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-document !>([path.act src.bowl doc (~(has by s) space.settings.doc)])]
        :_  this
        :~
          [%pass /engram/delta/document/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/delta/document/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Sync updates with current document
        ::
          %sync
        ::~&  "SYNC-- from {<src.bowl>}  for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  tid  `@ta`(cat 4 (cat 2 'document-sync-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %sync-document !>([path.act src.bowl settings.doc update.act (~(has by s) space.settings.doc)])]
        :_  this
        :~  
          [%pass /engram/sync/document/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/sync/document/[(cat 2 (scot %p -.id) (scot %ud +.id))]/[(scot %p src.bowl)]/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ::?>  (guardspace:engram [space.settings.doc (molt ~(val by content.roles.settings.doc)) (molt ~(val by content.ships.settings.doc)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        :_  this
        :~  [%pass /document/populate %agent [src.bowl %engram] %poke %post !>([%document %populate path.act doc])]
        ==
        ::
        :: Populate a requested document
        ::
          %populate
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        :_  this(d (~(put by d) id doc.act))
        :~  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.settings.doc.act)] ['type' (tape:enjs:format "space")] ['id' (path:enjs:format space.settings.doc.act)]]))]
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
          ^*  (index:index [@tas @tas])
          ^*  (index:index [@p @tas])
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
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        :: delete an existing folder
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by f) id)
        =/  copy  (~(got by f) id)
        =/  nstate  this(f (~(del by f) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %folder])
            =/  spclist  ~(tap by content.content.spc) 
            =/  idx  (find ~[[id %folder]] (turn spclist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %folder])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %folder]] (turn fldrlist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
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
        =/  id  [`@p`(slav %p -.id.act) `@u`(slav %ud -.+.id.act)]
        =/  to  [`@p`(slav %p -.to.act) `@u`(slav %ud -.+.to.act)]
        ?>  (~(has by f) to)
        =/  tofldr  (~(got by f) to)
        =/  nfldr
        =.  content.tofldr  (insert:index content.tofldr [id type.act] our.bowl)
        tofldr
        `this(f (~(put by f) to nfldr))
        :::_  this(f (~(put by f) to nfldr))
        :::~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall to.act])]
        ::==
        ::
        :: remove a document or folder from a folder
        ::
          %remove
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.id.act) `@u`(slav %ud -.+.id.act)]
        =/  from  [`@p`(slav %p -.from.act) `@u`(slav %ud -.+.from.act)]
        ?>  (~(has by f) from)
        =/  fromfldr  (~(got by f) from)
        =/  nfldr
        =.  content.fromfldr  (remove:index content.fromfldr id our.bowl)
        fromfldr
        `this(f (~(put by f) from nfldr))
        :::_  this(f (~(put by f) from nfldr))
        :::~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall from.act])]
        ::==
        ::
        :: Add a permission to a document
        ::
          %addperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  tofol  (~(got by f) id)
        =/  nfol
        ?+  type.act  !!
            %ships
          =.  ships.tofol  (insert:index ships.tofol [(slav %p perm.act) level.act] our.bowl)
          tofol
            %roles
          =.  roles.tofol  (insert:index roles.tofol [(slav %tas perm.act) level.act] our.bowl)
          tofol
        ==
        `this(f (~(put by f) id nfol))
        :::_  this(f (~(put by f) id nfol))
        :::~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall path.act])]
        ::==
        ::
        :: Remove a permission rule
        ::
          %removeperm
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        =/  item  [`@p`(slav %p -.item.act) `@u`(slav %ud -.+.item.act)]
        =/  nfold
        ?+  type.act  !!
            %roles
          =.  roles.fold  (remove:index roles.fold item our.bowl)
          fold
            %ships
          =.  ships.fold  (remove:index ships.fold item our.bowl)
          fold
        ==
        `this(f (~(put by f) id nfold))
        :::_  this(f (~(put by f) id nfold))
        :::~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall path.act])]
        ::==
        ::
        :: Rename a folder
        ::
          %rename
        ?>  =(src.bowl our.bowl)

        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ~_  [%leaf "Error renaming folder of id: {<id>}"]
        ?.  (~(has by f) id)
          ~&  "Could not find folder!"  !!
        =/  old  (~(got by f) id)
        ?.  =(owner.old our.bowl)
          ~&  "You do not have the right to rename this folder!"  !!
        =/  new
        =.  name.old  name.act
        old
        `this(f (~(put by f) id new))
        :::_  this(f (~(put by f) id new))
        :::~  [%pass /folder/updateall %agent [our.bowl %engram] %poke %post !>([%folder %updateall path.act])]
        ::==
        ::
        ::  Gather updated to a folder index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- items in {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.fold -.+.space.fold ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.fold)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (weld directpeers spacepeers)
            |=  peer=@p
            [%pass /engram/folder/gather %agent [our.bowl %engram] %poke %post !>([%folder %gather path.act peer])]
        ==
        ::
        ::  A Helper to send update notifs to everyone with access to a folder
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fol  (~(got by f) id)
        ?:  =(space.fol /null/space)  ~&  "Folder does not belong to a space"  `this
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.fol -.+.space.fol ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.fol)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (weld (weld directpeers spacepeers) ~[owner.fol])
            |=  peer=@p 
            [%pass /folder/update %agent [peer %engram] %poke %post !>([%folder %update path.act])]
        ==
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by f) id)
          :: If we do not have this folder request it
          :_  this
          :~  [%pass /folder/request %agent [peer.act %engram] %poke %post !>([%folder %request path.act peer.act])]
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by f) id)  ~&  "{<our.bowl>} does not know about {<path.act>} yet"  `this
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        ?>  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        :_  this
        :~  [%pass /folder/populate %agent [src.bowl %engram] %poke %post !>([%folder %populate path.act fold])]
        ==
        ::
        :: Populate a requested document
        ::
          %populate
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
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
        =/  spc
        ?:  =(our.bowl (slav %p -.space.act))
          =.  roles.initspc  (insert:index roles.initspc ^-([@tas @tas] [%member %editor]) our.bowl)
          initspc
        initspc
        `this(s (~(put by s) space.act spc))
        ::
        :: Add a permission to a document
        ::
          %addperm
        ?>  =(src.bowl our.bowl)
        =/  tospc  (~(got by s) space.act)
        =/  nspc
        ?+  type.act  !!
            %ships
          =.  ships.tospc  (insert:index ships.tospc [(slav %p perm.act) level.act] our.bowl)
          tospc
            %roles
          =.  roles.tospc  (insert:index roles.tospc [(slav %tas perm.act) level.act] our.bowl)
          tospc
        ==
        :_  this(s (~(put by s) space.act nspc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        
        ::
        :: Remove a permission rule
        ::
          %removeperm
        ?>  =(src.bowl our.bowl)
        =/  spc  (~(got by s) space.act)
        =/  id  [`@p`(slav %p -.item.act) `@u`(slav %ud -.+.item.act)]
        =/  nspc
        ?+  type.act  !!
            %roles
          =.  roles.spc  (remove:index roles.spc id our.bowl)
          spc
            %ships
          =.  ships.spc  (remove:index ships.spc id our.bowl)
          spc
        ==
        :_  this(s (~(put by s) space.act nspc))
        :~  [%pass /space/updateall %agent [our.bowl %engram] %poke %post !>([%space %updateall space.act])]
        ==
        ::
        ::  Gather updated to a space index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- items in {<space.act>}"
        ?.  (~(has by s) space.act)  ~&  "No space at this path"  `this
        =/  spc  (~(got by s) space.act)
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.act -.+.space.act ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.spc)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (weld directpeers spacepeers)
            |=  peer=@p
            [%pass /engram/space/gather %agent [our.bowl %engram] %poke %post !>([%space %gather space.act peer])]
        ==
        ::
        ::  A Helper to send update notifs to everyone with access to a space
        ::
          %updateall
        ?>  =(src.bowl our.bowl)
        ::~&  "UPDATEDALL-- {<spc.act>}"
        ?.  (~(has by s) space.act)  ~&  "No space at this path"  `this
        =/  spc  (~(got by s) space.act)
        =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.act -.+.space.act ~.members ~.noun])
        ?+  -.spacemembers  !!
            %members
          =/  directpeers  %+  turn  ~(val by content.ships.spc)  |=  a=[@p @tas]  -.a
          =/  spacepeers  %~  tap  in  %~  key  by  ^-  members:membership  +.spacemembers
          :_  this
          %+  turn  (weld directpeers spacepeers)
            |=  peer=@p 
            [%pass /space/update %agent [peer %engram] %poke %post !>([%space %update space.act])]
        ==
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
        ::~&  "GATHER-- {<space.act>} from: {<peer.act>}"
        =/  spc  (~(got by s) space.act)
        :_  this
        :~  [%pass /engram/space %agent [peer.act %engram] %poke %post !>([%space %delta space.act version.content.spc])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<space.act>}"
        ?:  =(src.bowl our.bowl)  `this
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
        ::~&  "SYNC-- from {<src.bowl>} for {<space.act>}: "
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
    =/  id=id  [`@p`(slav %p i.t.p) `@u`(slav %ud i.t.t.p)]
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
    ``noun+!>((list:document:enjs:engram d))
  ::
      [%x %document @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    ?.  (~(has by d) id)
      ``noun+!>((tape:enjs:format "missing document"))
    =/  doc  (~(got by d) id)
    ``noun+!>((get:document:enjs:engram doc))
  ::
      [%x %document @ @ %meta ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    ?.  (~(has by d) id)
      ``noun+!>((tape:enjs:format "missing document"))
    =/  doc  (~(got by d) id)
    ``noun+!>((meta:document:enjs:engram doc))
  ::
      [%x %document @ @ %perms ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((perms:document:enjs:engram settings.doc))
  ::
      [%x %document @ @ %snapshots ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((snapshots:document:enjs:engram snapshots.doc))
  ::
      [%x %document @ @ %content ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ?:  (~(has by u) id)
      =/  updts  (need (~(get by u) id))
      ``noun+!>((content:document:enjs:engram [doc updts]))
    ``noun+!>((content:document:enjs:engram [doc ^*((set dupdate))]))
  ::
      [%x %document @ @ %updates ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    ?:  (~(has by u) id)
      =/  updts  (need (~(get by u) id))
      ``noun+!>((updates:document:enjs:engram updts))
    ``noun+!>((updates:document:enjs:engram ^*((set dupdate))))
  ::
      [%x %folder @ @ %list ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((list:folder:enjs:engram fold))
  ::
      [%x %folder @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((list:folder:enjs:engram fold))
  ::
      [%x %folder @ @ %meta ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((meta:folder:enjs:engram fold))
  ::
      [%x %folder @ @ %perms ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((perms:folder:enjs:engram fold))
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
              %gather-document-success  `this
              %delta-document-success   `this
              %sync-document-success
            =/  id  [`@p`(slav %p -.path.res) `@u`(slav %ud -.+.path.res)]
            =/  doc  (~(got by d) id)
            ::  Document Changes
            =/  ndoc
              =:  name.settings.doc  name.update.res
                  roles.settings.doc  (apply:index roles.settings.doc roles.update.res)
                  ships.settings.doc  (apply:index ships.settings.doc ships.update.res)
                ==
              doc
            =/  dstate  this(d (~(put by d) id ndoc))
            ::  Update Changes
            ::~&  "--- Sunk Document :) ---"  
            :_  dstate(u (~(gas ju u) content.update.res))
            :~  [%give %fact ~[/updates] %json !>((pairs:enjs:format ~[['space' (path:enjs:format space.settings.doc)] ['type' (tape:enjs:format "document")] ['id' (path:enjs:format path.res)]]))]
            ==
            ::
              %gather-folder-success  `this
              %delta-folder-success   `this
              %sync-folder-success
            =/  id  [`@p`(slav %p -.path.res) `@u`(slav %ud -.+.path.res)]   
            =/  fol  (~(got by f) id)
            ::  Folder Changes
            =/  nfol
              =:  name.fol  name.update.res
                  roles.fol  (apply:index roles.fol roles.update.res)
                  ships.fol  (apply:index ships.fol ships.update.res)
                  content.fol  (apply:index content.fol content.update.res)
                ==
              fol
            ::~&  "--- Sunk Folder :) ---"  
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
                ships.spc  (apply:index ships.spc ships.update.res)
                content.spc  (apply:index content.spc content.update.res)
              ==
            spc
            =/  diff  (~(dif by content.content.nspc) content.content.spc)
            =/  sstate  this(s (~(put by s) space.res nspc))
            ::~&  "--- Sunk Space :) ---" 
            :_  sstate
              %+  snoc  
                %+  turn  ~(tap by diff)
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
++  on-arvo   on-arvo:def
++  on-fail   
  |=  [=term =tang]
  ~&  "Fail with term {<term>}"
  (on-fail:def term tang)
--
