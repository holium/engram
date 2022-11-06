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
        `this(t (add t 1))
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
        `this(d (~(put by d) id doc.action))
        ::
        ::
        ::
          %snap
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        `this(su (~(add ja su) id snap.action))
        ::
        :: modify document settings
        ::
          %settings
        =/  id  [(slav %p -.path.action) (slav %u -.+.path.action)]
        ?>  (~(has by d) id)
        `this(s (~(put by s) dmeta.action stg.action))
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
        ?<  (~(has by f) fmeta.action)
        `this(f (~(put by f) fmeta.action ~))
        ::
        :: delete an existing folder
        ::
          %delete
        ?>  (~(has by f) fmeta.action)
        `this(f (~(del by f) fmeta.action))
        ::
        :: add a document or folder to another folder
        ::
          %add
        ?>  (~(has by f) fmeta.action)
        `this(f (~(put ju f) fmeta.action fldr.action))
        ::
        :: remove a document or folder from a folder
        ::
          %remove
        ?>  (~(has by f) fmeta.action)
        =/  a  (~(get ju f) fmeta.action)
        ?:  =(~(wyt in a) 1)
            `this(f (~(put by f) fmeta.action ~))
        `this(f (~(del ju f) fmeta.action fldr.action))
        ::
        :: {Documentation Here}
        ::
          %rename
        =/  data=(set fldr:engram)  (~(get ja f) old.action)
        =/  new-folder=fldrs:engram  (~(del by f) old.action)
        `this(f (~(put by new-folder) new.action data))
      ==
      %prop
        ?-  -.+.action
        ::
        :: remove the merged update from the update list (as updates aren't implemented this will just log)
        ::
          %accept
        `this(u (~(del ju u) dmeta.action updt.action))
        ::
        :: {Documentation Here}
        ::
          %sub
        =/  li  /updates/(scot %ud id.dmeta.action)/(scot %da timestamp.dmeta.action)
        :_  this
        :~  [%pass `(list @ta)`[(wood 'engram') (wood (crip "{<our.bowl>}")) (wood (crip "{<owner.action>}")) ~] %agent [owner.action %engram] %watch li]
        ==
        ::
        :: {Documentation Here}
        ::
          %unsub
        :_  this
        :~  [%pass `(list @ta)`[(wood 'engram') (wood (crip "{<our.bowl>}")) (wood (crip "{<owner.action>}")) ~] %agent [owner.action %engram] %leave ~]
        ==
        ::
        :: {Documentation Here}
        ::
          %update
        `this(u (~(put ju u) id.action update.action))
        ::
        ::
        :: {Documentation Here}
        ::
          %update-live
        =/  li  /updates/(scot %ud id.dmeta.action)/(scot %da timestamp.dmeta.action)
        :_  this
        :~  %-  fact:agentio
          [update+!>(`update:engram`[%update [dmeta.action updt.action]]) ~[li]]
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
    =/  id=@  (slav %ud i.t.path)
    =/  timestamp=@d  (slav %da i.t.t.path)
    =/  meta  [id=id timestamp=timestamp]
    =/  stg=[perms=(list @p) owner=@p name=@t]  (need (~(get by s) meta))
    ?~  (find [src.bowl]~ perms.stg)
      !!
    :_  this
    =/  stg  (need (~(get by s) meta))
    =/  docu  (need (~(get by d) meta))
    =/  ups  (~(get ju u) meta)
    =/  li  /updates/(scot %ud id.meta)/(scot %da timestamp.meta)
    :~  %-  fact-init:agentio
      update+!>(`update:engram`[%init meta docu stg ups])
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
