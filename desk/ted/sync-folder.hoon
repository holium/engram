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
?>  ?|  (~(has by content.ships.fol) src)
    =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.fol -.+.space.fol ~.members ~.noun])
    ?+  -.spacemembers  !!
      %members  (~(has by +.spacemembers) src)
:*  %sync-folder-success 
    path 
    peer
    :*
      name.update
      roles.update
      ships.update
      content.update
    ==
==
--
^-  thread:spider
|=  starter=vase
=/  args  !<(fthread-sync starter)
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
(pure:m !>((make-sync [path.args peer.args our now fol.args update.args])))