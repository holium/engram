/-  *engram
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  ^-  action
  ~&  'json'
  ~&  jon
  ~&  'parsed'
  ~&
    %.  jon
    %-  of 
    :~  
      [%make (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) doc+(ot ~[version+(ar ni) content+(ar ni)])])]
    ==
  ::^-  [%make dmeta=[owner=@p id=@ name=@t] doc=[version=(list @ud) cont=(list @ud)]]
  %.  jon
  %-  of 
  :~  
    [%make (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) doc+(ot ~[version+(ar ni) content+(ar ni)])])]
  ==

--
