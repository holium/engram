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
  ==

--
