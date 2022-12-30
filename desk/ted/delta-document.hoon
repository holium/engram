/-  spider
/-  *engram
/-  index
/+  engram
/+  index
/+  *strandio
=,  strand=strand:spider
|%
++  make-delta
|=  [path=path doc=document src=@p our=@p now=@da]
?>  %:  guardspace:engram 
    space.settings.doc 
    (molt ~(val by content.roles.settings.doc)) 
    (molt ~(val by content.ships.settings.doc)) 
    (silt `(list @tas)`[%admin %editor %visitor ~]) 
    src 
    our 
    now
  ==
=/  updates  (silt ~[[author=our timestamp=now content=content.doc]])
=/  roles  (delta:index roles.settings.doc ^*(version:index))
=/  ships  (delta:index ships.settings.doc ^*(version:index))
[%post !>([%document %sync path [name.settings.doc roles ships updates]])]
--
^-  thread:spider
|=  starter=vase
=/  args  !<(dthread-delta starter)
::~&  "extracted: {<args>}"
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [src.args %engram] (make-delta [path.args doc.args src.args our now]))
(pure:m !>([%delta-document-success ~]))