/-  spider
/-  *engram
/-  index
/-  membership
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-sync
|=  [space=path peer=@p our=@p now=@da spc=space update=[roles=(update:index [@tas @tas]) content=(update:index [id @tas])]]
^-  thread-res
?>
      =/  spacemembers  .^(view:membership %gx ~[(scot %p our) ~.spaces (scot %da now) -.space -.+.space ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by ^-(members:membership +.spacemembers)) peer)
      ==
:*  %sync-space-success 
    space 
    peer
    :*
      roles.update
      content.update
    ==
==
--
^-  thread:spider
|=  starter=vase
=/  args  !<(sthread-sync starter)
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
(pure:m !>((make-sync [space.args peer.args our now spc.args update.args])))