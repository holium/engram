/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-delta
|=  [space=path spc=space version=version:index src=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space 
    (molt ~(val by content.roles.spc)) 
    (molt ~(val by content.ships.spc)) 
    (silt `(list @tas)`[%admin %editor %visitor ~]) 
    src 
    our 
    now
  ==
=/  updates  (delta:index content.spc version)
=/  roles  (delta:index roles.spc ^*(version:index))
=/  ships  (delta:index ships.spc ^*(version:index))
[%post !>([%space %sync space [roles ships updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(sthread-delta starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [space.args spc.args version.args src.args our now]))
(pure:m !>([%delta-space-success ~]))