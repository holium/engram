/-  *engram
/-  membership
/-  index
/+  engram
/+  index
/+  default-agent, dbug, agentio
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
    %0  `this(state old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
    =/  act  !<(action vase)
    ?-   -.act
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
        `hstate(t (add t 1))
        ::
        ::
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by d) id)
        =/  nstate  this(d (~(del by d) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %document])
            =/  spclist  ~(tap by content.content.spc) 
            ~&  (turn spclist |=(a=[[@p @u] [[@p @u] @tas]] +.a))
            ~&  [[id %document]]
            =/  idx  (find ~[[id %document]] (turn spclist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.+.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %document])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %document]] (turn fldrlist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) fldrlist)
            =.  content.fldr  (remove:index content.fldr -.+.todel our.bowl)
            fldr
          fldr
        =/  fstate  sstate(f fldrs)
        `fstate
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
        `this(d (~(put by d) id new))
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
        ::
        :: Remove an update for the set of stored updates
        ::
          %accept
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        `this(u (~(del ju u) id update.act))
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
        ::
        ::  A helper poke to gather updates from everyone who has access to a document
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ::~&  "GATHERALL-- {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?:  =(space.settings.doc /null/space)  ~&  "Document does not belong to a space"  `this
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
        ::  Gather updates to a document from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?:  =(our.bowl peer.act)
          `this
        ::~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  tid  `@ta`(cat 4 (cat 2 'document-sync-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %gather-document !>([path.act peer.act doc])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by d) id)  ~&  "{<our.bowl>} does not know about {<path.act>} yet"  `this
        =/  doc  (~(got by d) id)
        =/  tid  `@ta`(cat 4 (cat 2 'document-delta-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-document !>([path.act src.bowl doc])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Sync updates with current document
        ::
          %sync
        ~&  "SYNC-- from {<src.bowl>}  for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        =/  tid  `@ta`(cat 4 (cat 2 'document-sync-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %sync-document !>([path.act src.bowl settings.doc update.act])]
        :_  this
        :~  
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
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
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?>  (guardspace:engram [space.settings.doc (molt ~(val by content.roles.settings.doc)) (molt ~(val by content.ships.settings.doc)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        :_  this
        :~  [%pass /document/populate %agent [src.bowl %engram] %poke %post !>([%document %populate path.act doc])]
        ==
        ::
        :: Populate a requested document
        ::
          %populate
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        `this(d (~(put by d) id doc.act))
      ==
      %folder
        ?-  -.+.act
        ::
        :: create a new folder
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
        `hstate(t (add t 1))
        ::
        :: delete an existing folder
        ::
          %delete
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?>  (~(has by f) id)
        =/  nstate  this(f (~(del by f) id))
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has in (silt ~(val by content.content.spc))) [id %folder])
            =/  spclist  ~(tap by content.content.spc) 
            =/  idx  (find ~[[id %folder]] (turn spclist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) spclist)
            =.  content.spc  (remove:index content.spc -.+.todel our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has in (silt ~(val by content.content.fldr))) [id %folder])
            =/  fldrlist  ~(tap by content.content.fldr) 
            =/  idx  (find ~[[id %folder]] (turn fldrlist |=(a=[[@p @u] [[@p @u] @tas]] +.a)))
            =/  todel  (snag (need idx) fldrlist)
            =.  content.fldr  (remove:index content.fldr -.+.todel our.bowl)
            fldr
          fldr
        =/  fstate  sstate(f fldrs)
        `fstate
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
        ::  Gather updates to a folder from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?.  !=(our.bowl peer.act)
          `this
        ::~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fol  (~(got by f) id)
        =/  tid  `@ta`(cat 4 (cat 2 'folder-sync-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %gather-folder !>([path.act peer.act fol])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        ?.  (~(has by f) id)  ~&  "{<our.bowl>} does not know about {<path.act>} yet"  `this
        =/  fol  (~(got by f) id)
        =/  tid  `@ta`(cat 4 (cat 2 'folder-delta-' (scot %p +.id)) (cat 2 (scot %ud -.id) (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-folder !>([path.act src.bowl fol version.act])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
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
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
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
        :: Answer a request for a document
        ::
          %answer
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
        `this(f (~(put by f) id fold.act))
      ==
      %space
        ?-  -.+.act
        ::
        :: Initialize a space index
        ::
          %make
        ?>  =(src.bowl our.bowl)
        =/  spc  ^*  space
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
        `this(s (~(put by s) space.act nspc))
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
        `this(s (~(put by s) space.act nspc))
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
        ::  Gather updates to a space from a peer (pokes their %delta)
        ::
          %gather
        ?>  =(src.bowl our.bowl)
        ?.  !=(our.bowl peer.act)
          `this
        ::~&  "GATHER-- {<space.act>} from: {<peer.act>}"
        =/  spc  (~(got by s) space.act)
        =/  tid  `@ta`(cat 4 (cat 2 'space-sync-' -.+.space.act) (cat 2 -.space.act (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %gather-space !>([space.act peer.act spc])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ::~&  "DELTA-- from {<src.bowl>} for {<space.act>}"
        =/  spc  (~(got by s) space.act)
        =/  tid  `@ta`(cat 4 (cat 2 'space-delta-' -.+.space.act) (cat 2 -.space.act (scot %uv (sham eny.bowl))))
        =/  ta-now  `@ta`(scot %da now.bowl)
        =/  start-args  [~ `tid byk.bowl(r da+now.bowl) %delta-space !>([space.act src.bowl spc version.act])]
        :_  this
        :~
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
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
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
          [%pass /engram/thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
        ==
    ==
==
++  on-watch  on-watch:def
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
      [%x %space @ @ %list ~]
    ?>  =(src.bowl our.bowl)
    ?:  (~(has by s) ~[i.t.t.p i.t.t.t.p])
      =/  spc  (~(got by s) ~[i.t.t.p i.t.t.t.p])
      ``noun+!>((list:space:enjs:engram [d f content.content.spc]))
    ~&  "No space of path: {<`path`~[i.t.t.p i.t.t.t.p]>}"
    ``noun+!>((list:space:enjs:engram [d f ^*((map id [id @tas]))]))
    ::
      [%x %space @ @ %settings ~]
    ?:  (~(has by s) ~[i.t.t.p i.t.t.t.p])
      =/  spc  (~(got by s) ~[i.t.t.p i.t.t.t.p])
      ``noun+!>((settings:space:enjs:engram spc))
    ~&  "No space of path: {<`path`~[i.t.t.p i.t.t.t.p]>}"  !!
      [%x %document %list ~]
    ``noun+!>((list:document:enjs:engram d))
  ::
      [%x %document @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((get:document:enjs:engram doc))
  ::
      [%x %document @ @ %get %settings ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((settings:document:enjs:engram settings.doc))
  ::
      [%x %document @ @ %get %snapshots ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((snapshots:document:enjs:engram snapshots.doc))
  ::
      [%x %document @ @ %get %updates ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    ?:  (~(has by u) id)
      =/  updts  (need (~(get by u) id))
      ``noun+!>((updates:document:enjs:engram updts))
    ``noun+!>((updates:document:enjs:engram ^*((set dupdate))))
  ::
      [%x %folder %list ~]
    ?>  =(src.bowl our.bowl)
    ``noun+!>((list:folder:enjs:engram f))
  ::
      [%x %folder @ @ %get ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((list:space:enjs:engram [d f content.content.fold]))
  ::
      [%x %folder @ @ %get %settings ~]
    ?>  =(src.bowl our.bowl)
    =/  id=id  [`@p`(slav %p i.t.t.p) `@u`(slav %ud i.t.t.t.p)]
    =/  fold  (~(got by f) id)
    ``noun+!>((settings:folder:enjs:engram fold))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ~&  "Request on wire: {<wire>}"
    ?+    wire  (on-agent:def wire sign)
        [%engram @ @ ~]
      ?+    -.sign  (on-agent:def wire sign)
          %watch-ack
        ?~  p.sign
          ((slog '%engram: Subscribe succeeded!' ~) `this)
        ((slog '%engram: Subscribe failed!' ~) `this)
      ::
          %kick
        %-  (slog '%engram: Got kick, resubscribing...' ~)
        :_  this
        :~  [%pass `(list @ta)`[(wood 'engram') (wood (crip "{<our.bowl>}")) (wood (crip "{<src.bowl>}")) ~] %agent [src.bowl %engram] %watch /updates]
        ==
      ::
          %fact
        ?+    p.cage.sign  (on-agent:def wire sign)
            %noun
          `this
            %thread-fail
          =/  err  !<  (pair term tang)  q.cage.sign
          %-  (slog leaf+"Thread failed: {(trip p.err)}" q.err)
          `this
            %thread-done
          =/  res  !<(thread-res q.cage.sign)
          ~&  "Thread Result: {<-.res>}"
          ?+  -.res  ~&  "Bad thread result"  !!
              %gather-document-success  `this
              %delta-document-success   `this
              %sync-document-success
            =/  id  [`@p`(slav %p -.path.res) `@u`(slav %ud -.+.path.res)]
            =/  doc  (~(got by d) id)
            ::  Name Changes
            =/  namedoc
              ?.  -.name.update.res
                doc
              =.  name.settings.doc  +.name.update.res
              doc
            ::  Settings Changes
            =/  settingsdoc
              ?.  ?&(-.roles.update.res -.ships.update.res)
                namedoc
              =:  roles.settings.namedoc  (apply:index roles.settings.namedoc +.roles.update.res)
                  ships.settings.namedoc  (apply:index ships.settings.namedoc +.ships.update.res)
                ==
              namedoc
            =/  dstate  this(d (~(put by d) id namedoc))
            ?.  -.content.update.res
              ~&  "--- Sunk Document :) ---"  `dstate
              ::  Update Changes
            ~&  "--- Sunk Document :) ---"  `dstate(u (~(gas ju u) +.content.update.res))
            ::
              %gather-folder-success  `this
              %delta-folder-success   `this
              %sync-folder-success
            =/  id  [`@p`(slav %p -.path.res) `@u`(slav %ud -.+.path.res)]   
            =/  fol  (~(got by f) id)
            ::  Name Changes
            =/  namefol
              ?.  -.name.update.res
                fol
              =.  name.fol  +.name.update.res
              fol
            ::  Settings Changes
            =/  settingsfol
              ?.  ?&(-.roles.update.res -.ships.update.res)
                namefol
              =:  roles.namefol  (apply:index roles.namefol +.roles.update.res)
                  ships.namefol  (apply:index ships.namefol +.ships.update.res)
                ==
              namefol
            ::  Content  Changes
            =/  contentfol  
              ?.  -.content.update.res
                settingsfol
              =.  content.settingsfol  (apply:index content.settingsfol +.content.update.res)
              settingsfol
            ~&  "--- Sunk Folder :) ---"  `this(f (~(put by f) id contentfol))
            ::
              %gather-space-success  `this
              %delta-space-success   `this
              %sync-space-success
            =/  spc  (~(got by s) space.res)
            ::  Settings Changes
            =/  settingsspc
              ?.  ?&(-.roles.update.res -.ships.update.res)
                spc
              =:  roles.spc  (apply:index roles.spc +.roles.update.res)
                  ships.spc  (apply:index ships.spc +.ships.update.res)
                ==
              spc
            =/  contentspc
              ?.  -.content.update.res
                settingsspc
              =.  content.settingsspc  (apply:index content.settingsspc +.content.update.res)
              settingsspc
            =/  diff  (~(dif by content.content.contentspc) content.content.spc)
            =/  sstate  this(s (~(put by s) space.res contentspc))
            ~&  "--- Sunk Space :) ---" 
            :_  sstate
              %+  turn  ~(tap by diff)
              |=  item=[id [id @tas]]
              ?+  +.+.item  !!
                %document  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.+.item])]
                %folder    [%pass /folder/request %agent [our.bowl %engram] %poke %post !>([%folder %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.item])]
              ==
          ==
            %update
          =/  msg  !<  tape  q.cage.sign
          %-  (slog leaf+msg ~)
          `this
      ==
    ==
  ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
