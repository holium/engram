/-  spider
/-  *engram
/-  index
/-  membership
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-delta
|=  [path=path doc=document src=@p our=@p now=@da check-space=$?(%.y %.n)]
?>  ?|  =(owner.settings.doc src)  
      (~(has in (silt (turn ~(val by content.ships.settings.doc) |=(a=[@p @tas] -.a)))) src)
      ?.  check-space  %.n
      =/  spacemembers  .^(view:membership %gx ~[(scot %p our) ~.spaces (scot %da now) -.space.settings.doc -.+.space.settings.doc ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by ^-(members:membership +.spacemembers)) src)
      ==
    ==
=/  updates  (silt ~[[author=our timestamp=now content=content.doc]])
=/  roles  (delta:index roles.settings.doc ^*(version:index))
=/  ships  (delta:index ships.settings.doc ^*(version:index))
[%post !>([%document %sync path [name.settings.doc roles ships updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(dthread-delta starter)
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [path.args doc.args src.args our now check-space.args]))
(pure:m !>([%delta-document-success ~]))