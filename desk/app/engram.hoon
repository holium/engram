/-  *engram
/+  engram
/+  default-agent, dbug, agentio
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 t=localtime s=spaces d=documents f=folders u=updates]
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
  ?+    mark  (on-poke:def mark vase)
      %post
    =/  action  !<(action vase)
    ?-   -.action
      %document
        ?-  -.+.action
        ::
        :: initialize a new document with a blank document as passed by the frontend
        ::
          %make
        =/  doc  :*  
          [our.bowl t]
          version.action
          content.action
          :*  owner.action 
              name.action 
              roles.action
              ships.action
          ==
          (silt `(list dsnapshot)`[~])
        ==
        =/  state  this(d (~(put by d) [our.bowl t] doc))
        `state(t (add t 1))
        ::
        ::
        ::
          %delete
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        `this(d (~(del by d) id))
        ::
        :: modify a document by changing the stored document state
        ::
          %save
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        =/  old  (~(got by d) id)
        =/  new  
        =:  content.old  content.action
            version.old  version.action
          ==
        old
        `this(d (~(put by d) id new))
        ::
        ::
        ::
          %snap
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        =/  old  (~(got by d) id)
        =/  new
        =.  snapshots.old  (~(put in snapshots.old) snapshot.action)
        old
        `this(d (~(put by d) id new))
        ::
        :: modify document settings
        ::
          %settings
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        =/  old  (~(got by d) id)
        =/  new
        =:  owner.settings.old  owner.action
            name.settings.old   name.action
            roles.settings.old  roles.action
            ships.settings.old  ships.action
          ==
        old
        `this(d (~(put by d) id new))
        ::
        ::
        ::
        ::  %createsnap
        ::?<  (~(has by su) dmeta.action)
        ::`this(su (~(put by su) dmeta.action ~))
        ::
        ::
        ::
        ::  %dsnap
        ::?>  (~(has by su) dmeta.action)
        ::`this(su (~(del by su) dmeta.action))
        ::
        :: {Documentation Here}
        ::
        ::  %dsettings
        ::`this(s (~(del by s) dmeta.action))
      ==
      %folder
        ?-  -.+.action
        ::
        :: create a new folder
        ::
          %make
        =/  fold  :*  
          [our.bowl t]
          name.action
          roles.action
          ships.action
          ^*  index
        ==
        =/  state  this(f (~(put by f) [our.bowl t] fold))
        `state(t (add t 1))
        ::
        :: delete an existing folder
        ::
          %delete
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by f) id)
        `this(f (~(del by f) id))
        ::
        :: add a document or folder to another folder
        ::
        ::  %add
        ::?>  (~(has by f) fmeta.action)
        ::`this(f (~(put ju f) fmeta.action fldr.action))
        ::
        :: remove a document or folder from a folder
        ::
        ::  %remove
        ::?>  (~(has by f) fmeta.action)
        ::=/  a  (~(get ju f) fmeta.action)
        ::?:  =(~(wyt in a) 1)
        ::    `this(f (~(put by f) fmeta.action ~))
        ::`this(f (~(del ju f) fmeta.action fldr.action))
        ::
        :: {Documentation Here}
        ::
          %rename
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by f) id)
        =/  old  (~(got by f) id)
        =/  new
        =.  name.old  name.action
        old
        `this(f (~(put by f) id new))
      ==
      %prop
        ?-  -.+.action
        ::
        :: remove the merged update from the update list (as updates aren't implemented this will just log)
        ::
          %accept
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        `this(u (~(del ju u) id update.action))
        ::
        :: subscribe to a remote document
        ::
          %sub
        =/  li  `path`(weld ~['updates'] path.action)
        :_  this
        :~  [%pass `(list @ta)`[~.engram (wood (crip "{<our.bowl>}")) (wood (crip "{<to.action>}")) ~] %agent [to.action %engram] %watch li]
        ==
        ::
        :: {Documentation Here}
        ::
          %unsub
        :_  this
        :~  [%pass `(list @ta)`[~.engram (wood (crip "{<our.bowl>}")) (wood (crip "{<from.action>}")) ~] %agent [from.action %engram] %leave ~]
        ==
        ::
        :: {Documentation Here}
        ::
          %update
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        `this(u (~(put ju u) id update.action))
        ::
        ::
        :: {Documentation Here}
        ::
          %update-live
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        =/  li  `path`(weld ~['updates'] path.action)
        :_  this
        :~  %-  fact:agentio
          [update+!>(`update`[%update [path.action update.action]]) ~[li]]
        ==
        ::  %docsetup
        :::_  this
        :::~  [%pass /settings %agent [our.bowl %engram] %poke %post !>([%settings dmeta.action stg.action])]
        ::    [%pass /createsnap %agent [our.bowl %engram] %poke %post !>([%createsnap dmeta.action])]
        ::    [%pass /make %agent [our.bowl %engram] %poke %post !>([%make dmeta.action doc.action])]
        ::==
        ::  %extend
        ::=/  mut  |=  a=updt:engram  [dmeta:action a]
        ::=/  save  (turn ~(tap in updts.action) mut)
        ::=/  save  ~(tap in `(set dmeta:engram updt:engram)`(~(run in updts:action) mut))
        ::`this(u (~(gas ju u) save))
      ==
  ==
==
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%updates @ @ ~]
    =/  id  [(slav %p i.t.path) (slav %u i.t.t.path)]
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
++  on-peek
  |=  p=path
  ^-  (unit (unit cage))
  ?+    p  (on-peek:def p)
      [%x %document %list ~]
    ``noun+!>((list:document:enjs:engram d))
  ::
      [%x %document @ @ %get ~]
    =/  id=id  [(slav %p i.t.t.t.p) (slav %u i.t.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((get:document:enjs:engram doc))
  ::
      [%x %document @ @ %get %settings ~]
    =/  id=id  [(slav %p i.t.t.t.p) (slav %u i.t.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((settings:document:enjs:engram settings.doc))
  ::
      [%x %document @ @ %get %snapshots ~]
    =/  id=id  [(slav %p i.t.t.t.p) (slav %u i.t.t.t.t.p)]
    =/  doc  (~(got by d) id)
    ``noun+!>((snapshots:document:enjs:engram snapshots.doc))
  ::
      [%x %document @ @ %get %updates ~]
    =/  id=id  [(slav %p i.t.t.t.p) (slav %u i.t.t.t.t.p)]
    =/  updts  (need (~(get by u) id))
    ``noun+!>((updates:document:enjs:engram updts))
  ::
      [%x %folder %list ~]
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
          ?-  -.update
            %init
          `this
          ::=/  up=dupdate:engram  [author=src.bowl timestamp=timestamp.update.update content=content.update.update]
          :::_  this
          ::?:  (~(has by s) id.update)
          ::  :~  [%pass /settings %agent [our.bowl %engram] %poke %post !>([%settings dmeta.update stg.update])]
          ::      [%pass /update %agent [our.bowl %engram] %poke %post !>([%update dmeta.update up])]
          ::      [%pass /extend %agent [our.bowl %engram] %poke %post !>([%extend dmeta.update setupt.update])]
          ::  ==
          :::~  [%pass /setup %agent [our.bowl %engram] %poke %post !>([%docsetup dmeta.update doc.update stg.update])]
          ::    [%pass /extend %agent [our.bowl %engram] %poke %post !>([%extend dmeta.update setupt.update])]
          ::==
            %update
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
