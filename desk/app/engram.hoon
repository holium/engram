/-  engram
/+  engram
/+  default-agent, dbug, agentio
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 d=docs:engram f=fldrs:engram u=updts:engram s=dstgs:engram su=dsnaps:engram]
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
    =/  action  !<(?(action:engram) vase)
    ?-   -.action
    ::
    :: initialize a new document with a blank document as passed by the frontend
    ::
      %make
    ?<  (~(has by d) dmeta.action)
    `this(d (~(put by d) dmeta.action doc.action))
    ::
    ::
    ::
      %createsnap
    ?<  (~(has by su) dmeta.action)
    `this(su (~(put by su) dmeta.action ~))
    ::
    ::
    ::
      %snap
    `this(su (~(add ja su) dmeta.action snap.action))
    ::
    ::
    ::
      %dsnap
    ?>  (~(has by su) dmeta.action)
    `this(su (~(del by su) dmeta.action))
    ::
    :: modify a document by changing the stored document state
    ::
      %save
    ?>  (~(has by d) dmeta.action)
    `this(d (~(put by d) dmeta.action doc.action))
    ::
    :: remove a document from your document history
    ::
      %delete
    ?>  (~(has by d) dmeta.action)
    `this(d (~(del by d) dmeta.action))
    ::
    :: modify document settings
    ::
      %settings
    ~&  "modifying settings"
    ~&  action
    `this(s (~(put by s) dmeta.action stg.action))
    ::
    :: {Documentation Here}
    ::
      %dsettings
    `this(s (~(del by s) dmeta.action))
    ::
    :: create a new folder
    ::
      %mfolder
    ?<  (~(has by f) fmeta.action)
    `this(f (~(put by f) fmeta.action ~))
    ::
    :: delete an existing folder
    ::
      %dfolder
    ?>  (~(has by f) fmeta.action)
    `this(f (~(del by f) fmeta.action))
    ::
    :: add a document or folder to another folder
    ::
      %foldoc
    ?>  (~(has by f) fmeta.action)
    `this(f (~(put ju f) fmeta.action fldr.action))
    ::
    :: remove a document or folder from a folder
    ::
      %remfoldoc
    ?>  (~(has by f) fmeta.action)
    =/  a  (~(get ju f) fmeta.action)
    ?:  =(~(wyt in a) 1)
        `this(f (~(put by f) fmeta.action ~))
    `this(f (~(del ju f) fmeta.action fldr.action))
    ::
    :: {Documentation Here}
    ::
      %renamefolder
    =/  data=(set fldr:engram)  (~(get ja f) old.action)
    =/  new-folder=fldrs:engram  (~(del by f) old.action)
    `this(f (~(put by new-folder) new.action data))
    ::
    :: remove the merged update from the update list (as updates aren't implemented this will just log)
    ::
      %merge
    `this(u (~(del ju u) dmeta.action updt.action))
    ::
    :: {Documentation Here}
    ::
      %sub
    =/  li  /updates/(scot %ud id.dmeta.action)/(scot %da timestamp.dmeta.action)
    ~&  "subbing"
    ~&  action
    ~&  li
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
      %update-live
    =/  li  /updates/(scot %ud id.dmeta.action)/(scot %da timestamp.dmeta.action)
    :_  this
    :~  %-  fact:agentio
      [update+!>(`update:engram`[%update [dmeta.action updt.action]]) ~[li]]
    ==
      %docsetup
    ~&  "setting up document"
    ~&  action
    :_  this
    :~  [%pass /settings %agent [our.bowl %engram] %poke %post !>([%settings dmeta.action stg.action])]
        [%pass /createsnap %agent [our.bowl %engram] %poke %post !>([%createsnap dmeta.action])]
        [%pass /make %agent [our.bowl %engram] %poke %post !>([%make dmeta.action doc.action])]
    ==
    ::
    :: {Documentation Here}
    ::
      %update
    `this(u (~(put ju u) dmeta.action updt.action))
    ::
      %extend
    ~&  action
    =/  mut  |=  a=updt:engram  [dmeta:action a]
    =/  save  (turn ~(tap in updts.action) mut)
    ::=/  save  ~(tap in `(set dmeta:engram updt:engram)`(~(run in updts:action) mut))
    `this(u (~(gas ju u) save))
  ==
==
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ~&  "ship:"
  ~&  src.bowl
  ~&  "is watching path:"
  ~&  path
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
      [%pass `(list @ta)`[(wood 'engram') (wood (crip "{<our.bowl>}")) (wood (crip "{<src.bowl>}")) ~] %agent [owner.stg %engram] %watch li]
    ==
==
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ~&  "peek on path:"
  ~&  path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %docinfo ~]
    ``noun+!>((enjs-docinfo:engram s))
  ::
      [%x %gdoc @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    =/  meta  [id=id timestamp=timestamp]
    =/  doc  (need (~(get by d) meta))
    ``noun+!>((enjs-gdoc:engram doc))
  ::
      [%x %gsetting @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    =/  meta  [id=id timestamp=timestamp]
    =/  stg=[perms=(list @p) owner=@p name=@t]  (need (~(get by s) meta))
    ``noun+!>((enjs-gsetting:engram stg))
  ::
      [%x %gfolders ~]
    ``noun+!>((enjs-gfolders:engram f))
  ::
      [%x %getsnaps @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    =/  meta  [id=id timestamp=timestamp]
    =/  snap=(list snap:engram)  (need (~(get by su) meta))
    ``noun+!>((enjs-getsnaps:engram snap))
  ::
      [%x %gupdates @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    =/  meta  [id=id timestamp=timestamp]
    =/  upd  (~(get ju u) meta)
    ``noun+!>((enjs-gupdates:engram upd))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ~&  "Reached agent on wire"
    ~&  wire
    ?+    wire  ~&  "bad wire"  (on-agent:def wire sign)
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
          =/  update  !<(update:engram q.cage.sign)
          ~&  "Update"
          ~&  update
          ?-  -.update
            %init
          =/  up=updt:engram  [author=src.bowl cont=cont.doc.update time=timestamp.dmeta.update]

          :_  this
          ?:  (~(has by s) dmeta.update)
            ~&  "setting up docuent"
            :~  [%pass /setup %agent [our.bowl %engram] %poke %post !>([%docsetup dmeta.update doc.update stg.update])]
                [%pass /extend %agent [our.bowl %engram] %poke %post !>([%extend dmeta.update setupt.update])]
            ==
          ~&  "starting subscription connection"
          :~  [%pass /settings %agent [our.bowl %engram] %poke %post !>([%settings dmeta.update stg.update])]
              [%pass /update %agent [our.bowl %engram] %poke %post !>([%update dmeta.update up])]
              [%pass /extend %agent [our.bowl %engram] %poke %post !>([%extend dmeta.update setupt.update])]
          ==
            %update
          :_  this
          :~  [%pass /update %agent [our.bowl %engram] %poke %post !>([%update dmeta.update updt.update])]
          ==
          ==
        ==
      ==
    ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
