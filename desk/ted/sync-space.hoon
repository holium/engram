/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-sync
|=  [space=path peer=@p our=@p now=@da spc=space update=[roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
^-  thread-res
=/  passed-name      (guardspace:engram [space (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[~]) peer our now])
=/  passed-settings  (guardspace:engram [space (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin ~]) peer our now])
=/  passed-content   (guardspace:engram [space (molt ~(val by content.roles.spc)) (molt ~(val by content.ships.spc)) (silt `(list @tas)`[%admin %editor ~]) peer our now])
:*  %sync-space-success 
    space 
    peer
    :*
      :-  passed-settings  roles.update
      :-  passed-settings  ships.update
      :-  passed-content   content.update
    ==
==
--
^-  thread:spider
|=  starter=vase
=/  args  !<(sthread-sync starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
(pure:m !>((make-sync [space.args peer.args our now spc.args update.args])))