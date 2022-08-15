/-  engram
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
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ~&  path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %docinfo ~]
    =/  out  ~(tap in ~(key by d))
    =/  results  *(list [@t json])
    =/  counter  0
    =/  assembled
    |-
    ?:  =(counter (lent out))
      results
    =/  curr  (snag counter out)
    =/  meta  (pairs:enjs:format ~[['owner' (ship:enjs:format owner:curr)] ['name' (tape:enjs:format (trip name:curr))]])
    %=  $
      counter  (add counter 1)
      results  (snoc results [id:curr meta])
    ==
    ``noun+!>((pairs:enjs:format assembled))
  ::
      [%x %gdoc @ @ @ ~]
    ~&  "get document"
    =/  owner=@p  (slav %p i.t.t.path)
    =/  id=@  (crip (trip i.t.t.t.path))
    =/  name=@t  (crip (trip i.t.t.t.t.path))
    =/  meta  [owner=owner id=id name=name]
    =/  doc=[version=(list @ud) cont=(list @ud)]  (need (~(get by d) meta))
    ~&  doc
    =/  version-result  *(list [@t json])
    =/  version-counter  0
    =/  assembled-version
    |-
    ?:  =(version-counter (lent version:doc))
      version-result
    %=  $
      version-counter  (add version-counter 1)
      version-result  (snoc version-result [(crip "{<version-counter>}") (numb:enjs:format (snag version-counter version:doc))])
    ==
    =/  content-result  *(list [@t json])
    =/  content-counter  0
    =/  assembled-content
    |-
    ?:  =(content-counter (lent cont:doc))
      content-result
    ~&  (snag content-counter cont:doc)
    %=  $
      content-counter  (add content-counter 1)
      content-result  (snoc content-result [(crip "{<content-counter>}") (numb:enjs:format (snag content-counter cont:doc))])
    ==
    ~&  assembled-content
    ``noun+!>((pairs:enjs:format ~[['version' (pairs:enjs:format assembled-version)] ['content' (pairs:enjs:format assembled-content)]]))
  ::
      [%x %gsetting @ @ @ ~]
    ~&  "get document settings"
    =/  owner=@p  (slav %p i.t.t.path)
    =/  id=@  (slav %ud i.t.t.t.path)
    =/  name=@t  (crip (trip i.t.t.t.t.path))
    =/  meta  [owner=owner id=id name=name]
    ~&  meta
    =/  stg=[perms=(list @p)]  (need (~(get by s) meta))
    ~&  stg
    ``noun+!>(stg)
  ::
      [%x %gfolders @ @ @ ~]  ``noun+!>(f)
      :: (jug [id=@ name=@t] $%([%doc [owner=@p id=@ name=@t]] [%folder [id=@ name=@t]]))
    :: =/  t=(jug [id=@ name=@t] $%([%doc [owner=@p id=@ name=@t]] [%folder [id=@ name=@t]]))  f
  ==
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
