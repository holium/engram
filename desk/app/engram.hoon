/- *engram
/+ default-agent, dbug, agentio
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =journal =log]
+$  card  card:agent:gall
++  cache-orm  ((on @ action) lth)
++  unique-time
  |=  [=time =cache]
  ^-  @
  =/  unix-ms=@
    (unm:chrono:userlib time)
  |-
  ?.  (has:cache-orm cache unix-ms)
    unix-ms
  $(time (add unix-ms 1))
--
::
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
++  on-init  on-init:def
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-vase=vase
  ^-  (quip card _this)
  `this(state !<(versioned-state old-vase))
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  |^
  ?>  (team:title our.bowl src.bowl)
  ?.  ?=(%engram-act mark)  (on-poke:def mark vase)
  =/  now=@  (unique-time now.bowl cache)
  =/  act  !<(action vase)
  =.  state  (poke-action act)
  :_  this(log (put:cache-orm cache now act))
  ~[(fact:io engram-update+!>(`update`[now act]) ~[/updates])]
  ::
  ++  poke-action
    |=  act=action
    ^-  _state
    ?-    -.act
        %make
      ?<  (~(has by docs) doc.act)
      state(docs (~(put by docs) doc.act ~))
      !!
    ::
        %edit
      ?>  (~(has by docs) doc.act)
      state(docs (~(put by docs) doc.act chg.act))
    ::
        %del
      ?>  (~(has by docs) doc.act)
      state(journal (~(del by docs) doc.act))
    ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  (team:title our.bowl src.bowl)
  ?+  path  (on-watch:def path)
    [%updates ~]  `this
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  (team:title our.bowl src.bowl)
  =/  now=@  (unm:chrono:userlib now.bowl)
  ?+    path  (on-peek:def path)
      [%x %entries *]
    ?+    t.t.path  (on-peek:def path)
        [%all ~]
      :^  ~  ~  %engram-update
      !>  ^-  update
      [now %doc (tap:j-orm journal)]
    ==
  ::
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--