/-  engram
/+  engram
/+  default-agent, dbug
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
    def   ~(. (default-agent this %.n) bowl)
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
      %noun
    =/  action  !<(?(action:engram) vase)
    ?-    -.action
    ::
    :: initialize a new document with a blank document as passed by the frontend
    ::
      %make
    ?<  (~(has by d) dmeta.action)
    `this(d (~(put by d) dmeta.action doc.action))
    ::
     %createsnap
    ?<  (~(has by su) dmeta.action)
    `this(su (~(put by su) dmeta.action ~))
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
    `this(s (~(put by s) dmeta.action stg.action))
    ::
    ::
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
    ::
    ::
      %renamefolder
    ~&  old.action
    ~&  new.action
    =/  data=(set fldr:engram)  (~(get ja f) old.action)
    ~&  data
    =/  new-folder=fldrs:engram  (~(del by f) old.action)
    ~&  new-folder
    `this(f (~(put by new-folder) new.action data))
    ::
    :: remove the merged update from the update list (as updates aren't implemented this will just log)
    ::
      %merge
    `this(u (~(del ju u) dmeta.action updt.action))
    %sub
  ::  ~&  owner.dmeta.action
  :: !!
    =/  li  /updates/(scot %p owner.dmeta.action)/(scot %ud id.dmeta.action)/[`@ta`name.dmeta.action]
   :: ~&  li
    :_  this
    :~  [%pass /engram %agent [owner.dmeta.action %engram] %watch li]
    ==
    %unsub
    :_  this
    :~  [%pass /engram %agent [owner.dmeta.action %engram] %leave ~]
    ==

    %update-live
    =/  li  /updates/(scot %p owner.dmeta.action)/(scot %ud id.dmeta.action)/[`@ta`name.dmeta.action]
    :: ~&  li
    ~&  updt.action
    :_  this
    :~  [%give %fact ~[li] %noun !>(updt.action)]
    ==
    %update
    `this(u (~(put ju u) dmeta.action updt.action))
    ==
  ==

++  on-watch
  |=  =path
  ^-  (quip card _this)
  ~&  "hi from nut"
  ?+    path  (on-watch:def path)
      [%updates @ @ @ ~]
    ::~&  i.t.path
    =/  owner=@p  (slav %p i.t.path)
    ::~&  owner
    =/  id=@  (slav %ud i.t.t.path)
    ::~&  id
    =/  name=@t  (crip (trip i.t.t.t.path))
    ::~&  name
    =/  meta  [owner=owner id=id name=name]
    =/  stg=[perms=(list @p)]  (need (~(get by s) meta))
    ::~&  src.bowl
    ::~&  perms.stg
    ?~  (find [src.bowl]~ perms.stg)
     :: ~&  "is null"
      !!
    ~&  'check print zod'
    :_  this
    ~&  'this should print'
    =/  stg  (need (~(get by s) meta))
    ~&  stg
    =/  docu  (need (~(get by d) meta))
    ~&  docu
       :~  [%give %fact ~ %noun !>(stg+docu)]
    ==   
==
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %docinfo ~]
    ``noun+!>((enjs-docinfo:engram s))
  ::
      [%x %gdoc @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    ~&  (di:dejs:format [%n p=i.t.t.t.path])
    ~&  timestamp
    =/  meta  [id=id timestamp=timestamp]
    ~&  meta
    =/  doc=[version=(list @ud) cont=(list @ud)]  (need (~(get by d) meta))
    ``noun+!>(doc)
  ::
      [%x %gsetting @ @ ~]
    =/  id=@  (crip (trip i.t.t.path))
    =/  timestamp=@d  (di:dejs:format [%n p=i.t.t.t.path])
    =/  meta  [id=id timestamp=timestamp]
    =/  stg=[perms=(list @p) owner=@p name=@t]  (need (~(get by s) meta))
    ~&  stg
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
    ~&  snap
    ``noun+!>((enjs-getsnaps:engram snap))
      [%x %gupdates @ @ @ ~]
    =/  owner=@p  (slav %p i.t.t.path)
    =/  id=@  (slav %ud i.t.t.t.path)
    =/  name=@t  (crip (trip i.t.t.t.t.path))
    =/  meta  [owner=owner id=id name=name]
    =/  upd  (need (~(get by u) meta))
    ``noun+!>(upd)
  ==
::
++  on-agent  
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ::~&  "This should print- nut"
    ?+    wire  (on-agent:def wire sign)
        [%engram ~]
      ?+    -.sign  (on-agent:def wire sign)
          %watch-ack
        ?~  p.sign
          ((slog '%engram: Subscribe succeeded!' ~) `this)
        ((slog '%engram: Subscribe failed!' ~) `this)
      ::
          %kick
        %-  (slog '%engram: Got kick, resubscribing...' ~)
        :_  this
        :~  [%pass /subs %agent [src.bowl %engram] %watch /updates]
        ==
      ::
          %fact
        ?+    p.cage.sign  (on-agent:def wire sign)
            %noun
          ~&  'logging'
          ~&  q.cage.sign
          ::~&  !<(update:engram q.cage.sign)
          `this
        ==
      ==
    ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--