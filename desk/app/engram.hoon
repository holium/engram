/-  engram
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 hist=docs:engram]
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
  `this(hist ~)
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
    :: initialize a new document with a nil document history
    ::
      %make
    ?<  (~(has by hist) +.action)
    `this(hist (~(put by hist) +.action ~))
    ::
    :: modify a document by prepending a new change in its history
    :: note: try to serve the data in reverse order to have newer data at the end of the array
    ::
      %modify
    ?>  (~(has by hist) +<.action)
    `this(hist (~(add ja hist) +<.action +>.action))
    ::
    :: remove a document from your document history
    ::
      %delete
    ?>  (~(has by hist) +.action)
    `this(hist (~(del by hist) +.action))
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