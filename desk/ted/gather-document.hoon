/-  spider
/-  *engram
/+  engram
/+  *strandio
=,  strand=strand:spider
|%
++  make-gather
|=  [path=path doc=document peer=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space.settings.doc
    (molt ~(val by content.roles.settings.doc)) 
    (molt ~(val by content.ships.settings.doc)) 
    (silt `(list @tas)`[%admin %editor ~]) 
    peer 
    our 
    now
  ==
[%post !>([%document %delta path])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(dthread-gather starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [peer.args %engram] (make-gather path.args doc.args peer.args our now))
(pure:m !>([%gather-document-success ~]))