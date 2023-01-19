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
|=  [path=path fol=folder version=version:index src=@p our=@p now=@da]
?>  ?|  (~(has in (silt (turn ~(val by content.ships.fol) |=(a=[@p @tas] -.a)))) src)
      =/  spacemembers  .^(view:membership %gx ~[(scot %p our) ~.spaces (scot %da now) -.space.fol -.+.space.fol ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by ^-(members:membership +.spacemembers)) src)
      ==
    ==
=/  updates  (delta:index content.fol version)
=/  roles  (delta:index roles.fol ^*(version:index))
=/  ships  (delta:index ships.fol ^*(version:index))
[%post !>([%folder %sync path [name.fol roles ships updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(fthread-delta starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [path.args fol.args version.args src.args our now]))
(pure:m !>([%delta-folder-success ~]))