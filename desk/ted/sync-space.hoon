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
?>  ?|  (~(has by content.ships.spc) src)
      =/  spacemembers  .^(view:membership %gx `path`~[(scot %p our.bowl) ~.spaces (scot %da now.bowl) -.space.spc -.+.space.spc ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by +.spacemembers) src)
:*  %sync-space-success 
    space 
    peer
    :*
      roles.update
      ships.update
      content.update
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