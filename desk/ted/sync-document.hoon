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
|=  [path=path peer=@p our=@p now=@da settings=dsettings update=[name=@t roles=(update:index [@tas @tas]) ships=(update:index [@p @tas]) content=(set dupdate)]]
^-  thread-res
=/  id  [`@p`(slav %p -.path) `@u`(slav %ud -.+.path)]
?>  ?|  (~(has in (silt (turn ~(val by content.ships.settings) |=(a=[@p @tas] -.a)))) peer)
      =/  spacemembers  .^(view:membership %gx ~[(scot %p our) ~.spaces (scot %da now) -.space.settings -.+.space.settings ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by ^-(members:membership +.spacemembers)) peer)
      ==
    ==
:*  %sync-document-success 
    path 
    peer
    :*
      name.update
      roles.update
      ships.update
      %+  turn  ~(tap in content.update)  |=  a=dupdate  [id a]
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