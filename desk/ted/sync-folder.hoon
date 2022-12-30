/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-sync
|=  [path=path peer=@p our=@p now=@da fol=folder update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(update:index [id @tas])]]
^-  thread-res
=/  id  [`@p`(slav %p -.path) `@u`(slav %ud -.+.path)]
=/  passed-name      (guardspace:engram [space.fol (molt ~(val by content.roles.fol)) (molt ~(val by content.ships.fol)) (silt `(list @tas)`[~]) peer our now])
=/  passed-settings  (guardspace:engram [space.fol (molt ~(val by content.roles.fol)) (molt ~(val by content.ships.fol)) (silt `(list @tas)`[%admin ~]) peer our now])
=/  passed-content   (guardspace:engram [space.fol (molt ~(val by content.roles.fol)) (molt ~(val by content.ships.fol)) (silt `(list @tas)`[%admin %editor ~]) peer our now])
:*  %sync-folder-success 
    path 
    peer
    :*
      :-  passed-name      name.update
      :-  passed-settings  roles.update
      :-  passed-settings  ships.update
      :-  passed-content   content.update
    ==
==
--
^-  thread:spider
|=  starter=vase
=/  args  !<(fthread-sync starter)
~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
(pure:m !>((make-sync [path.args peer.args our now fol.args update.args])))