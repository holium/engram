/-  *engram
|%
++  dejs
  |%
  ++  action
    =,  dejs:format
    ::=,  ag
    |=  jon=json
    ^-  action
    %.  jon
    %-  of  
    :~  :-  %document  %-  of
      :~  [%make (ot ~[name+so content+sa version+sa roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
          ::[%docsetup (ot ~[dmeta+(ot ~[id+so timestamp+di]) doc+(ot ~[version+(ar ni) content+sa]) stg+(ot ~[perms+(ar (se %p)) owner+(se %p) name+so])])]
          [%delete (ot ~[id+pa])]
          [%save (ot ~[id+pa content+sa version+sa])]
          [%snap (ot ~[id+pa snapshot+(ot ~[timestamp+di author+(se %p) data+sa])])]
          ::[%dsnap (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
          [%settings (ot ~[id+pa name+so roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
          ::[%dsettings (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
      ==
      :-  %folder  %-  of  :~
        [%make (ot ~[name+so roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
        [%delete (ot ~[id+pa])]
        ::[%renamefolder (ot ~[old+(ot ~[id+so name+so]) new+(ot ~[id+so name+so])])]
        [%add (ot ~[to+pa id+pa])]
        [%remove (ot ~[from+pa id+pa])]
        ::[%createsnap (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
      ==
      :-  %prop  %-  of  :~
        [%accept (ot ~[id+pa update+(ot ~[author+(se %p) timestamp+di content+sa])])]
        [%sub (ot ~[id+pa ship+(se %p)])]
        [%unsub (ot ~[ship+(se %p)])]
        [%update-live (ot ~[id+pa update+(ot ~[author+(se %p) timestamp+di content+sa])])]
      ==
    ==
  --
++  enjs
  |%
  ++  document
    |%
    ++  list
      =,  enjs:format
      |=  docs=documents
      %~  tap  in  %-  ~(run in ~(key by docs))  |=  id=id
      =/  doc  (~(get by docs) id)
      [(spat ~[(wood (scot %p -.id)) (wood (scot %u +.id))]) (pairs ~[['name' name.settings.doc] ['owner' owner.settings.doc]])]
    ++  get
      =,  enjs:format
      |=  doc=document
      %-  pairs  :~ 
        ['id' (path ~[(wood (scow %p -.id.doc))]) (wood (scow %u +.id.doc))]
        ['version' (tape version.doc)]
        ['content' (tape content.doc)]
        ['settings' (settings settings.doc)]
        ['snapshots' (snapshots snapshots.doc)]
      ==
    ++  settings
      =,  enjs:format
      |=  settings=dsettings
      %-  pairs  :~
        ['name' (tape name.settings)]
        ['owner' (tape (scow %p owner.settings))]
      ==
    ++  updates
      =,  enjs:format
      |=  updates=(set dupdate)
      %-  pairs  %~  tap  in  %-  ~(run in updates)  |=  update=dupdate
        [(scot %da timestamp.update) (pairs ~[['author' (tape (scow %p author.update))] ['content' (tape content.update)]])]

    ++  snapshots
      =,  enjs:format
      |=  snaps=(list snap)
      %-  pairs  %+  murn  snaps  |=  snap=dsnapshot
        [(scot %da timestamp.snap) (pairs ~[['author' (tape (scow %p author.snap))] ['snapshot' (tape data.snap)]])]
    --
  ++  folders
    |%
    ++  enjs-gfolders
      =,  enjs:format
      |=  folds=folders
      %~  tap  in  %-  ~(run in ~(key by folds))  |=  id=id
      =/  fold  (~(get by folds) id)
      [(spat ~[(wood (scot %p -.id)) (wood (scot %u +.id))]) (pairs ~[['name' name.fold]])]
      ::=/  keys  ~(tap in ~(key by folders))
      ::=/  results  *(list [@t json])
      ::=/  counter  0
      ::=/  assembled
      ::|-
      ::?:  =(counter (lent keys))
      ::  results
      ::=/  key  (snag counter keys)
      ::=/  curr  (~(get by folders) key)
      ::=/  meta  (pairs ~[['id' (tape (trip `cord`id:key))] ['name' (tape (trip name:key))]])
      ::=/  items  ~(tap in (~(get ju folders) key))
      ::=/  content-results  *(list [@t json])
      ::=/  content-counter  0
      ::=/  content
      ::  %-
      ::    pairs
      ::  |-
      ::  ?:  =(content-counter (lent items))
      ::    content-results
      ::  =/  item  (snag content-counter items)
      ::  =/  res
      ::    ?-  -.item
      ::        [%doc]
      ::      (pairs ~[['id' (tape (trip `cord`id:dmeta:item))] ['timestamp' (time timestamp:dmeta:item)]])
      ::        [%folder]
      ::      (pairs ~[['id' (tape (trip `cord`id:fmeta:item))] ['name' (tape (trip name:fmeta:item))]])
      ::    ==
      ::  %=  $
      ::    content-counter  (add content-counter 1)
      ::    content-results  (snoc content-results [(crip "{<content-counter>}") res])
      ::  ==
      ::%=  $
      ::  counter  (add counter 1)
      ::  results  (snoc results [(crip "{<counter>}") (pairs ~[['meta' (pairs ~[['id' (tape (trip `@t`id:key))] ['name' (tape (trip name:key))]])] ['content' content]])])
      ::==
      ::(pairs assembled)
    --
  --
--