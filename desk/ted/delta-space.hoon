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
|=  [space=path spc=space version=version:index src=@p our=@p now=@da]
?>
      =/  spacemembers  .^(view:membership %gx ~[(scot %p our) ~.spaces (scot %da now) -.space -.+.space ~.members ~.noun])
      ?+  -.spacemembers  !!
        %members  (~(has by ^-(members:membership +.spacemembers)) src)
      ==
=/  updates  (delta:index content.spc version)
=/  roles  (delta:index roles.spc ^*(version:index))
[%post !>([%space %sync space [roles updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(sthread-delta starter)
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [space.args spc.args version.args src.args our now]))
(pure:m !>([%delta-space-success ~]))