/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-delta
|=  [path=path fol=folder version=version:index src=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space.fol 
    (molt ~(val by content.roles.fol)) 
    (molt ~(val by content.ships.fol)) 
    (silt `(list @tas)`[%admin %editor %visitor ~]) 
    src 
    our 
    now
  ==
=/  updates  (delta:index content.fol version)
=/  roles  (delta:index roles.fol ^*(version:index))
=/  ships  (delta:index ships.fol ^*(version:index))
[%post !>([%folder %sync path [name.fol roles ships updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(fthread-delta starter)
~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [path.args fol.args version.args src.args our now]))
(pure:m !>([%delta-folder-success ~]))