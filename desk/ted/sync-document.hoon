/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-sync
|=  [path=path peer=@p our=@p now=@da settings=dsettings update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(set dupdate)]]
^-  thread-res
=/  id  [`@p`(slav %p -.path) `@u`(slav %ud -.+.path)]
=/  passed-name      (guardspace:engram [space.settings (molt ~(val by content.roles.settings)) (molt ~(val by content.ships.settings)) (silt `(list @tas)`[~]) peer our now])
=/  passed-settings  (guardspace:engram [space.settings (molt ~(val by content.roles.settings)) (molt ~(val by content.ships.settings)) (silt `(list @tas)`[%admin ~]) peer our now])
=/  passed-content   (guardspace:engram [space.settings (molt ~(val by content.roles.settings)) (molt ~(val by content.ships.settings)) (silt `(list @tas)`[%admin %editor ~]) peer our now])
:*  %sync-document-success 
    path 
    peer
    :*
      :-  passed-name      name.update
      :-  passed-settings  roles.update
      :-  passed-settings  ships.update
      :-  passed-content   %+  turn  ~(tap in content.update)  |=  a=dupdate  [id a]
    ==
==
--
^-  thread:spider
|=  starter=vase
=/  args  !<(dthread-sync starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
(pure:m !>((make-sync [path.args peer.args our now settings.args update.args])))