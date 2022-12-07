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
  ::?+    mark  (on-poke:def mark vase)
  ::    %post
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
        ~&  newspc
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
        ~&  "Trying to remove from space"
        =/  spcs
          %-  ~(run by s)  |=  spc=space
          ?:  (~(has by content.content.spc) id)
            ~&  "Removing from space"
            =.  content.spc  (remove:index content.spc id our.bowl)
            spc
          spc
        ~&  spcs
        =/  sstate  nstate(s spcs)
        ~&  "Trying to remove from folder"
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has by content.content.fldr) id)
            ~&  "Removing from folder"
            =.  content.fldr  (remove:index content.fldr id our.bowl)
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
        :: give a ship permissions
        ::
          %addship
        ?>  =(src.bowl our.bowl)
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  todoc  (~(got by d) id)
        =/  ndoc
        =.  ships.settings.todoc  (insert:index ships.settings.todoc [ship.act level.act] our.bowl)
        todoc
        `this(d (~(put by d) id ndoc))
          %addrole
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  todoc  (~(got by d) id)
        =/  ndoc
        =.  roles.settings.todoc  (insert:index roles.settings.todoc [role.act level.act] our.bowl)
        todoc
        `this(d (~(put by d) id ndoc))
        ::
        ::  A helper poke to gather updates from everyone who has access to a document
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ~&  "GATHERALL-- {<path.act>}"
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
        ?.  !=(our.bowl peer.act)
          `this
        ~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?>  (guardspace:engram [space.settings.doc (molt ~(val by content.roles.settings.doc)) (molt ~(val by content.ships.settings.doc)) (silt `(list @tas)`[%admin %editor ~]) peer.act our.bowl now.bowl])
        :_  this
        :~  [%pass /document/delta %agent [peer.act %engram] %poke %post !>([%document %delta path.act])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ?>  (guardspace:engram [space.settings.doc (molt ~(val by content.roles.settings.doc)) (molt ~(val by content.ships.settings.doc)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        =/  updates  (silt ~[[author=our.bowl timestamp=now.bowl content=content.doc]])
        =/  roles  (delta:index roles.settings.doc ^*(version:index))
        =/  ships  (delta:index ships.settings.doc ^*(version:index))
        :_  this
        :~  [%pass /document/sync %agent [src.bowl %engram] %poke %post !>([%document %sync path.act [name.settings.doc roles ships updates]])]
        ==
        ::
        ::  Sync updates with current document
        ::
          %sync
        ~&  "SYNC-- from {<src.bowl>}  for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  doc  (~(got by d) id)
        ::  Name Changes
        =/  namedoc
          ?.  (guardspace:engram [space.settings.doc (molt ~(val by content.roles.settings.doc)) (molt ~(val by content.ships.settings.doc)) (silt `(list @tas)`[~]) src.bowl our.bowl now.bowl])
            doc
          =.  name.settings.doc  name.update.act
          doc
        ::  Settings Changes
        =/  settingsdoc
          ?.  (guardspace:engram [space.settings.namedoc (molt ~(val by content.roles.settings.namedoc)) (molt ~(val by content.ships.settings.namedoc)) (silt `(list @tas)`[%admin ~]) src.bowl our.bowl now.bowl])
            namedoc
          =:  roles.settings.namedoc  (apply:index roles.settings.namedoc roles.update.act)
              ships.settings.namedoc  (apply:index ships.settings.namedoc ships.update.act)
            ==
          namedoc  ::replace with actually making changes
        =/  dstate  this(d (~(put by d) id namedoc))
        =/  updates
        %+  turn  ~(tap in content.update.act)
        |=  a=dupdate  
        [id a]
        `dstate(u (~(gas ju u) updates))
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
          ?:  (~(has by content.content.spc) id)
            =.  content.spc  (remove:index content.spc id our.bowl)
            spc
          spc
        =/  sstate  nstate(s spcs)
        =/  fldrs
          %-  ~(run by f)  |=  fldr=folder
          ?:  (~(has by content.content.fldr) id)
            =.  content.fldr  (remove:index content.fldr id our.bowl)
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
          ~&  "You do not have the right to rename this flder!"  !!
        =/  new
        =.  name.old  name.act
        old
        `this(f (~(put by f) id new))
        ::
        ::  Gather updated to a folder index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ~&  "GATHERALL-- items in {<path.act>}"
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
        ~&  "GATHER-- {<path.act>} from: {<peer.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        ?>  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[%admin %editor ~]) peer.act our.bowl now.bowl])
        :_  this
        :~  [%pass /engram/(scot %p peer.act)/folder/delta %agent [peer.act %engram] %poke %post !>(`action`[%folder %delta path.act version.content.fold])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ~&  "DELTA-- from {<src.bowl>} for {<path.act>}"
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        ?>  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        =/  updates  (delta:index content.fold version.act)
        =/  roles  (delta:index roles.fold ^*(version:index))
        =/  ships  (delta:index ships.fold ^*(version:index))
        :_  this
        :~  [%pass /engram/folder/sync %agent [src.bowl %engram] %poke %post !>(`action`[%folder %sync path.act [name.fold roles ships updates]])]
        ==
        ::
        ::  Sync updates with current folder
        ::
          %sync
        ~&  "SYNC-- from {<src.bowl>} for {<path.act>}: "
        =/  id  [`@p`(slav %p -.path.act) `@u`(slav %ud -.+.path.act)]
        =/  fold  (~(got by f) id)
        ?>  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[%admin %editor ~]) src.bowl our.bowl now.bowl])
        ::  Name Changes
        =/  namefold
          ?.  (guardspace:engram [space.fold (molt ~(val by content.roles.fold)) (molt ~(val by content.ships.fold)) (silt `(list @tas)`[~]) src.bowl our.bowl now.bowl])
            fold
          =.  name.fold  name.update.act
          fold
        ::  Settings Changes
        =/  settingsfold
          ?.  (guardspace:engram [space.namefold (molt ~(val by content.roles.namefold)) (molt ~(val by content.ships.namefold)) (silt `(list @tas)`[%admin ~]) src.bowl our.bowl now.bowl])
            namefold
          =:  roles.namefold  (apply:index roles.namefold roles.update.act)
              ships.namefold  (apply:index ships.namefold ships.update.act)
            ==
          namefold  ::replace with actually making changes
        =/  contentfold
        =.  content.settingsfold  (apply:index content.settingsfold content.update.act)
        settingsfold
        `this(f (~(put by f) id contentfold))
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
        ::  Gather updated to a space index from all peers in the space
        ::
          %gatherall
        ?>  =(src.bowl our.bowl)
        ~&  "GATHERALL-- items in {<space.act>}"
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
        ~&  "GATHER-- {<space.act>} from: {<peer.act>}"
        =/  spc  (~(got by s) space.act)
        ?>  (guardspace:engram [space.act (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin %editor ~]) peer.act our.bowl now.bowl])
        :_  this
        :~  [%pass /engram/(scot %p peer.act)/space/delta %agent [peer.act %engram] %poke %post !>(`action`[%space %delta space.act version.content.spc])]
        ==
        ::
        ::  Assemble and reply with updates (pokes their sync)
        ::
          %delta
        ~&  "DELTA-- from {<src.bowl>} for {<space.act>}"
        =/  spc  (~(got by s) space.act)
        ?>  (guardspace:engram [space.act (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin %editor %visitor ~]) src.bowl our.bowl now.bowl])
        =/  updates  (delta:index content.spc version.act)
        =/  roles  (delta:index roles.spc ^*(version:index))
        =/  ships  (delta:index ships.spc ^*(version:index))
        :_  this
        :~  [%pass /engram/space/sync %agent [src.bowl %engram] %poke %post !>(`action`[%space %sync space.act [roles ships updates]])]
        ==
        ::
        ::  Sync updates with current space
        ::
          %sync
        ~&  "SYNC-- from {<src.bowl>} for {<space.act>}: "
        ~&  update.act
        =/  spc  (~(got by s) space.act)
        ?>  (guardspace:engram [space.act (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin %editor ~]) src.bowl our.bowl now.bowl])
        ::  Settings Changes
        =/  settingsspc  
          ?.  (guardspace:engram [space.act (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin ~]) src.bowl our.bowl now.bowl])
            spc
          =:  roles.spc  (apply:index roles.spc roles.update.act)
              ships.spc  (apply:index ships.spc ships.update.act)
            ==
          spc  ::replace with actually making changes
        =/  contentspc
        =.  content.spc  (apply:index content.spc content.update.act)
        settingsspc
        ~&  contentspc
        =/  diff  (~(dif by content.content.contentspc) content.content.spc)
        =/  sstate  this(s (~(put by s) space.act contentspc))
        :_  sstate
          %+  turn  ~(tap by diff)
          |=  item=[id [id @tas]]
          ?+  +.+.item  !!
            %document  [%pass /document/request %agent [our.bowl %engram] %poke %post !>([%document %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.+.item])]
            %folder    [%pass /folder/request %agent [our.bowl %engram] %poke %post !>([%folder %request `path`[(scot %p -.-.+.item) (scot %ud +.-.+.item) ~] -.-.item])]
          ==
    ==
==
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%updates @ @ ~]
    =/  id  [`@p`(slav %p i.t.path) `@u`(slav %ud i.t.t.path)]
    =/  doc  (~(got by d) id)
    ?~  (find [src.bowl]~ ships.settings.doc)
      !!
    :_  this
    =/  li  /updates/(scot %p -.id)/(scot %u +.id)
    :~  %-  fact-init:agentio
      update+!>(`update`[%init id settings.doc (~(get ju u) id)])
      ::[%pass `(list @ta)`[(wood 'engram') (wood (crip "{<our.bowl>}")) (wood (crip "{<src.bowl>}")) ~] %agent [owner.stg %engram] %watch li]
    ==
==
++  on-leave  on-leave:def
:: iced sugar cookie with oat milk
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
      ~&  "Requested space: "
      ~&  spc
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
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
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
            %update
          =/  update  !<(update q.cage.sign)
          =/  doc  (~(got by d) id.update)
          ?-  -.update
            %init
          :_  this
          ?:  =(src.bowl owner.settings.doc)
            %+  weld  ~[[%pass /settings %agent [our.bowl %engram] %poke %post !>([%settings id.update settings.update])]]
            %~  tap  in
            ^-  (set card)
            %-  ~(run in updates.update)  
              |=  updt=dupdate  
              [%pass /update %agent [our.bowl %engram] %poke %post !>([%update id.update updt])]
          =/  perm
          (need (find [[src.bowl %editor]]~ ~(val by content.ships.settings.doc)))
          %~  tap  in
          ^-  (set card)
          %-  ~(run in updates.update)  
            |=  updt=dupdate  
            [%pass /update %agent [our.bowl %engram] %poke %post !>([%update id.update updt])]
            %update
          =/  perm
          (need (find [[src.bowl %editor]]~ ~(val by content.ships.settings.doc)))
          :_  this
          :~  [%pass /update %agent [our.bowl %engram] %poke %post !>([%update id.update update.update])]
          ==
        ==
      ==
    ==
  ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
