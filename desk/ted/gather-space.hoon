/-  spider
/-  *engram
/+  engram
/+  *strandio
=,  strand=strand:spider
|%
++  make-gather
|=  [space=path spc=space peer=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space 
    (molt ~(val by content.roles.spc)) 
    (molt ~(val by content.ships.spc)) 
    (silt `(list @tas)`[%admin %editor ~]) 
    peer 
    our 
    now
  ==      
[%post !>([%space %delta space version.content.spc])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(sthread-gather starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [peer.args %engram] (make-gather space.args spc.args peer.args our now))
(pure:m !>([%gather-space-success ~]))