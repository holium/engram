/-  spider
/-  *engram
/+  engram
/+  *strandio
=,  strand=strand:spider
|%
++  make-gather
|=  [path=path fol=folder peer=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space.fol
    (molt ~(val by content.roles.fol)) 
    (molt ~(val by content.ships.fol)) 
    (silt `(list @tas)`[%admin %editor ~]) 
    peer 
    our 
    now
  ==
[%post !>([%folder %delta path version.content.fol])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(fthread-gather starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [peer.args %engram] (make-gather path.args fol.args peer.args our now))
(pure:m !>([%gather-folder-success ~]))