/-  *engram
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  ^-  action
  ~&  jon
  %.  jon
  %-  of
  :~
    [%make (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) doc+(ot ~[version+(ar ni) content+(ar ni)])])]
    [%delete (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so])])]
    [%save (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) doc+(ot ~[version+(ar ni) content+(ar ni)])])]
    [%merge (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) index+(ni)])]
    [%snap (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) snap+(ot ~[date+di ship+(se %p) data+(ar ni)])])]
  ==

--
