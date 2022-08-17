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
    [%merge (ot ~[dmeta+(ot ~[owner+(se %p) id+so name+so]) index+ni])]
    [%mfolder (ot ~[fmeta+(ot ~[id+so name+so])])]
    [%dfolder (ot ~[fmeta+(ot ~[id+so name+so])])]
    ::[%foldoc (ot ~[fmeta+(ot ~[id+so name+so]) doc+(ot ~[owner+(se %p) id+so name+so])])]
    ::[%remfoldoc (ot ~[fmeta+(ot ~[id+so name+so]) doc+(ot ~[owner+(se %p) id+so name+so])])]
  ==
++  enjs-gdoc
  =,  enjs:format
  |=  document=doc
  =/  version-result  *(list [@t json])
  =/  version-counter  0
  =/  assembled-version
  |-
  ?:  =(version-counter (lent version:document))
    version-result
  %=  $
    version-counter  (add version-counter 1)
    version-result  (snoc version-result [(crip "{<version-counter>}") (numb:enjs:format (snag version-counter version:document))])
  ==
  =/  content-result  *(list [@t json])
  =/  content-counter  0
  =/  assembled-content
  |-
  ?:  =(content-counter (lent cont:document))
    content-result
  %=  $
    content-counter  (add content-counter 1)
    content-result  (snoc content-result [(crip "{<content-counter>}") (numb:enjs:format (snag content-counter cont:document))])
  ==
  (pairs:enjs:format ~[['version' (pairs:enjs:format assembled-version)] ['content' (pairs:enjs:format assembled-content)]])
++  enjs-docinfo
  =,  enjs:format
  |=  docs=(list dmeta)
  =/  results  *(list [@t json])
  =/  counter  0
  =/  assembled
  |-
  ?:  =(counter (lent docs))
    results
  =/  curr  (snag counter docs)
  =/  meta  (pairs ~[['owner' (ship owner:curr)] ['name' (tape (trip name:curr))]])
  %=  $
    counter  (add counter 1)
    results  (snoc results [id:curr meta])
  ==
  (pairs assembled)
--
