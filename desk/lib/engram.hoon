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
    [%createsnap (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so])])]
    [%merge (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) index+ni])]
    [%snap (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) snap+(ot ~[date+di ship+(se %p) data+(ar ni)])])]
  ==
++  enjs-getsnaps
  =,  enjs:format
  |=  snaps=(list snap)
  =/  counter  0
  =/  results  *(list [@t json])
  =/  assembled
  |-
    ?:  =(counter (lent snaps))
      results
    =/  curr  (snag counter snaps)
    =/  data  data:curr
    =/  data-counter  0
    =/  data-results  *(list [@t json])
    =/  data-assembled
    |-
    ?:  =(data-counter (lent data))
      data-results
    %=  $
      data-counter  (add data-counter 1)
      data-results  (snoc data-results [(crip "{<data-counter>}") (numb (snag data-counter data))])
    ==
  %=  $
    counter  (add counter 1)
    results  (snoc results [(crip "{<counter>}") (pairs ~[['date' (time date:curr)] ['ship' (ship ship:curr)] ['data' (pairs data-assembled)]])])
  ==
  (pairs assembled)
--
