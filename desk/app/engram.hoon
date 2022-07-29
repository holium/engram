/-  engram
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 val=docs:engram]
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
  `this(val ~)
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
      %make
    ?<  (~(has by val) +.action)
    `this(val (~(put by val) +.action ~))
    ::
      %modify
    ?>  (~(has by val) +<.action)
    `this(val (~(add ja val) +<.action +>.action))
    ::
      %delete
    ?>  (~(has by val) +.action)
    `this(val (~(del by val) +.action))
    ==
  ==
::
++  on-watch  on-watch:def
::
++  on-leave  on-leave:def
::
++  on-peek   on-peek:def
::
++  on-agent  on-agent:def
::
++  on-arvo   on-arvo:def
::
++  on-fail   on-fail:def
::
--