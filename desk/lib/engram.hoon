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
    [%foldoc (ot ~[fmeta+(ot ~[id+so name+so]) fldr+(of ~[[[%doc] (ot ~[owner+(se %p) id+so name+so])] [[%folder] (ot ~[id+so name+so])]])])]
    [%remfoldoc (ot ~[fmeta+(ot ~[id+so name+so]) fldr+(of ~[[[%doc] (ot ~[owner+(se %p) id+so name+so])] [[%folder] (ot ~[id+so name+so])]])])]
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
++  enjs-gsetting
  =,  enjs:format
  |=  settings=stg
  =/  results  *(list [@t json])
  =/  counter  0
  =/  assembled
  |-
  ?:  =(counter (lent perms:settings))
    results
  =/  curr  (snag counter perms:settings)
  %=  $
    results  (snoc results [(crip "{<counter>}") (ship curr)])
  ==
  (pairs assembled)
++  enjs-gfolders
  =,  enjs:format
  |=  folders=(jug fmeta fldr)
  =/  keys  ~(tap in ~(key by folders))
  ~&  "keys"
  ~&  (lent keys)
  ~&  keys
  =/  results  *(list [@t json])
  =/  counter  0
  =/  assembled
  |-
  ?:  =(counter (lent keys))
    results
  =/  key  (snag counter keys)
  =/  curr  (~(get by folders) key)
  =/  meta  (pairs ~[['id' (tape (trip `cord`id:key))] ['name' (tape (trip name:key))]])
  =/  items  ~(tap in (~(get ju folders) key))
  ~&  "items"
  ~&  items
  =/  content-results  *(list [@t json])
  =/  content-counter  0
  =/  content
    %-
      pairs
    |-
    ?:  =(content-counter (lent items))
      content-results
    =/  item  (snag content-counter items)
    ~&  item
    =/  res  
      ?-  -.item
          [%doc]
        (pairs ~[['owner' (ship owner:dmeta:item)] ['id' (tape (trip `cord`id:dmeta:item))] ['name' (tape (trip name:dmeta:item))]]) 
          [%folder]
        (tape "folder")
      ==
    %=  $
      content-counter  (add content-counter 1)
      content-results  (snoc content-results [(crip "<content-counter>}") res])
    ==
  ~&  key
  %=  $
    counter  (add counter 1)
    results  (snoc results [(crip "{<counter>}") (pairs ~[['meta' (pairs ~[['id' (tape (trip `@t`id:key))] ['name' (tape (trip name:key))]])] ['content' content]])])
  ==
  (pairs assembled)
--
