/-  *engram
|%
++  dejs-action
  =,  dejs:format
  |=  jon=json
  ^-  action
  ~&  "Parsing json:"
  ~&  jon
  %.  jon
  %-  of
  :~
    [%make (ot ~[dmeta+(ot ~[id+so timestamp+di]) doc+(ot ~[version+(ar ni) content+sa])])]
    [%docsetup (ot ~[dmeta+(ot ~[id+so timestamp+di]) doc+(ot ~[version+(ar ni) content+sa]) stg+(ot ~[perms+(ar (se %p)) owner+(se %p) name+so])])]
    [%delete (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
    [%save (ot ~[dmeta+(ot ~[id+so timestamp+di]) doc+(ot ~[version+(ar ni) content+sa])])]
    [%settings (ot ~[dmeta+(ot ~[id+so timestamp+di]) stg+(ot ~[perms+(ar (se %p)) owner+(se %p) name+so])])]
    [%dsettings (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
    [%mfolder (ot ~[fmeta+(ot ~[id+so name+so])])]
    [%dfolder (ot ~[fmeta+(ot ~[id+so name+so])])]
    [%renamefolder (ot ~[old+(ot ~[id+so name+so]) new+(ot ~[id+so name+so])])]
    [%foldoc (ot ~[fmeta+(ot ~[id+so name+so]) fldr+(of ~[[[%doc] (ot ~[id+so timestamp+di])] [[%folder] (ot ~[id+so name+so])]])])]
    [%remfoldoc (ot ~[fmeta+(ot ~[id+so name+so]) fldr+(of ~[[[%doc] (ot ~[id+so timestamp+di])] [[%folder] (ot ~[id+so name+so])]])])]
    [%createsnap (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
    [%merge (ot ~[dmeta+(ot ~[id+so timestamp+di]) update+(ot ~[author+(se %p) content+sa time+di])])]
    [%snap (ot ~[dmeta+(ot ~[id+so timestamp+di]) snap+(ot ~[date+di ship+(se %p) data+(ar ni)])])]
    [%dsnap (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
    [%sub (ot ~[dmeta+(ot ~[id+so timestamp+di]) ship+(se %p)])]
    [%unsub (ot ~[ship+(se %p)])]
    [%update-live (ot ~[dmeta+(ot ~[id+so timestamp+di]) update+(ot ~[author+(se %p) content+sa time+di])])]
  ==
++  enjs-docinfo
  =,  enjs:format
  |=  stgs=dstgs
  =/  docs  ~(tap in ~(key by stgs))
  =/  results  *(list [@t json])
  =/  counter  0
  %-  pairs
  |-
  ?:  =(counter (lent docs))
    results
  =/  curr  (snag counter docs)
  =/  dstg  (~(got by stgs) curr)
  =/  meta  (pairs ~[['id' (pairs ~[['id' (tape (trip id:curr))] ['timestamp' (time timestamp:curr)]])] ['name' (tape (trip name:dstg))] ['owner' (ship owner:dstg)]])
  %=  $
    counter  (add counter 1)
    results  (snoc results [id:curr meta])
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
  (pairs:enjs:format ~[['version' (pairs:enjs:format assembled-version)] ['content' (tape:enjs:format cont:document)]])
++  enjs-gsetting
  =,  enjs:format
  |=  settings=stg
  =/  wl  *(list [@t json])
  =/  counter  0
  =/  assembled-wl
  |-
  ?:  =(counter (lent perms:settings))
    wl
  =/  curr  (snag counter perms:settings)
  %=  $
    counter  (add counter 1)
    wl  (snoc wl [(crip "{<counter>}") (ship curr)])
  ==
  (pairs ~[['owner' (ship owner:settings)] ['name' (tape (trip name:settings))] ['whitelist' (pairs assembled-wl)]])
++  enjs-gfolders
  =,  enjs:format
  |=  folders=fldrs
  =/  keys  ~(tap in ~(key by folders))
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
  =/  content-results  *(list [@t json])
  =/  content-counter  0
  =/  content
    %-
      pairs
    |-
    ?:  =(content-counter (lent items))
      content-results
    =/  item  (snag content-counter items)
    =/  res
      ?-  -.item
          [%doc]
        (pairs ~[['id' (tape (trip `cord`id:dmeta:item))] ['timestamp' (time timestamp:dmeta:item)]])
          [%folder]
        (pairs ~[['id' (tape (trip `cord`id:fmeta:item))] ['name' (tape (trip name:fmeta:item))]])
      ==
    %=  $
      content-counter  (add content-counter 1)
      content-results  (snoc content-results [(crip "{<content-counter>}") res])
    ==
  %=  $
    counter  (add counter 1)
    results  (snoc results [(crip "{<counter>}") (pairs ~[['meta' (pairs ~[['id' (tape (trip `@t`id:key))] ['name' (tape (trip name:key))]])] ['content' content]])])
  ==
  (pairs assembled)
++  enjs-gupdates
  =,  enjs:format
  |=  updts=(set updt)
  =/  lupdts  ~(tap in updts)
  =/  counter  0
  =/  results  *(list [@t json])
  =/  assembled
  |-
    ?:  =(counter (lent lupdts))
      results
    =/  curr  (snag counter lupdts)
  %=  $
    counter  (add counter 1)
    results  (snoc results [(crip "{<counter>}") (pairs ~[['timestamp' (time time:curr)] ['author' (ship author:curr)] ['content' (tape cont:curr)]])])
  ==
  (pairs assembled)
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
