/-  engram
/+  engram
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 d=docs:engram f=fldrs:engram u=updts:engram s=dstgs:engram]
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
      %post
    =/  action  !<(?(action:engram) vase)
    ?-    -.action
    ::
    :: initialize a new document with a blank document as passed by the frontend
    ::
      %make
    ?<  (~(has by d) dmeta.action)
    `this(d (~(put by d) dmeta.action doc.action))
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
    :: remove the merged update from the update list (as updates aren't implemented this will just log)
    ::
     %merge
    ~|  "merge"
    !!
    ==
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%updates ~]
     :: ~&  "log"
    :: !!
    =/  a  (~(get by s) dmeta.update)
    ?>  (~(has in perms.a) src.bowl)
    :_  this
       :~  [%give %fact ~ %engram-update !>(`update:todo`initial+tasks)]
    ==
  ==
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ~&  path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %docinfo ~]
    =/  docs  ~(tap in ~(key by d))
    ``noun+!>((enjs-docinfo:engram docs))
  ::
      [%x %gdoc @ @ @ ~]
    =/  owner=@p  (slav %p i.t.t.path)
    =/  id=@  (crip (trip i.t.t.t.path))
    =/  name=@t  (crip (trip i.t.t.t.t.path))
    =/  meta  [owner=owner id=id name=name]
    =/  doc=[version=(list @ud) cont=(list @ud)]  (need (~(get by d) meta))
    ``noun+!>((enjs-gdoc:engram doc))
  ::
      [%x %gsetting @ @ @ ~]
    =/  owner=@p  (slav %p i.t.t.path)
    =/  id=@  (slav %ud i.t.t.t.path)
    =/  name=@t  (crip (trip i.t.t.t.t.path))
    =/  meta  [owner=owner id=id name=name]
    =/  stg=[perms=(list @p)]  (need (~(get by s) meta))
    ~&  stg
    ``noun+!>((enjs-gsetting:engram stg))
  ::
      [%x %gfolders @ @ @ ~]
    ``noun+!>((enjs-gfolders:engram f))
      :: (jug [id=@ name=@t] $%([%doc [owner=@p id=@ name=@t]] [%folder [id=@ name=@t]]))
    :: =/  t=(jug [id=@ name=@t] $%([%doc [owner=@p id=@ name=@t]] [%folder [id=@ name=@t]]))  f
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ?+    wire  (on-agent:def wire sign)
        [%subs ~]
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
            %engram-update
          ~&  !<(update:engram q.cage.sign)
          `this
        ==
      ==
    ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
