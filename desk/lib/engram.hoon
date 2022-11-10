/-  engram
|%
++  dejs
  |%
  ++  action
    =,  dejs:format
    |=  jon=json
    ^-  action:engram
    %.  jon
    %-  of  
    :~  :-  %document  %-  of
      :~  [%make (ot ~[owner+(se %p) name+so space+pa content+sa version+sa roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
          ::[%docsetup (ot ~[dmeta+(ot ~[id+so timestamp+di]) doc+(ot ~[version+(ar ni) content+sa]) stg+(ot ~[perms+(ar (se %p)) owner+(se %p) name+so])])]
          [%delete (ot ~[id+pa])]
          [%save (ot ~[id+pa content+sa version+sa])]
          [%snap (ot ~[id+pa snapshot+(ot ~[timestamp+di author+(se %p) data+sa])])]
          ::[%dsnap (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
          [%settings (ot ~[id+pa owner+(se %p) name+so roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
          ::[%dsettings (ot ~[dmeta+(ot ~[id+so timestamp+di])])]
      ==
      :-  %folder  %-  of  :~
        [%make (ot ~[owner+(se %p) name+so space+pa oles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
        [%delete (ot ~[id+pa])]
        [%rename (ot ~[id+pa name+so])]
        [%add (ot ~[to+pa id+pa type+so])]
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
  ++  space
    |%
    ++  list
      =,  enjs:format
      |=  [docs=documents:engram ids=(set id:engram)]
      ^-  json
      %-  pairs  %~  tap  in  
      ^-  (set [@t json])
      %-  ~(run in ids)
      |=  id=id:engram
      =/  doc  (~(got by docs) id)
      :-  (spat ~[(scot %p -.id) (scot %u +.id)])
      (pairs ~[['name' (tape (trip name.settings.doc))] ['owner' (tape (scow %p owner.settings.doc))]])
    --
  ++  document
    |%
    ++  list
      =,  enjs:format
      |=  docs=documents:engram
      ^-  json
      %-  pairs  %~  tap  in  
      ^-  (set [@t json])
      %-  ~(run in ~(key by docs))
      |=  id=id:engram
      =/  doc  (~(got by docs) id)
      :-  (spat ~[(scot %p -.id) (scot %u +.id)])
      (pairs ~[['name' (tape (trip name.settings.doc))] ['owner' (tape (scow %p owner.settings.doc))]])
    ++  get
      =,  enjs:format
      |=  doc=document:engram
      ^-  json
      %-  pairs  :~ 
        ['id' (path ~[(scot %p -.id.doc) (scot %u +.id.doc)])]
        ['version' (tape version.doc)]
        ['content' (tape content.doc)]
        ::['settings' (settings settings.doc)]
        ::['snapshots' (snapshots snapshots.doc)]
      ==
    ++  settings
      =,  enjs:format
      |=  settings=dsettings:engram
      ^-  json
      %-  pairs  :~
        ['name' (tape (trip name.settings))]
        ['owner' (tape (scow %p owner.settings))]
      ==
    ++  updates
      =,  enjs:format
      |=  updts=(set dupdate:engram)
      ^-  json
      %-  pairs  %~  tap  in
        ^-  (set [@t json])
        %-  ~(run in updts)
        |=  updt=dupdate:engram
        [(scot %da timestamp.updt) (pairs ~[['author' (tape (scow %p author.updt))] ['content' (tape content.updt)]])]
    ++  snapshots
      =,  enjs:format
      |=  snaps=(set dsnapshot:engram)
      ^-  json
      %-  pairs  %~  tap  in
        ^-  (set [@t json])
        %-  ~(run in snaps)
        |=  snap=dsnapshot:engram
        [(scot %da timestamp.snap) (pairs ~[['author' (tape (scow %p author.snap))] ['content' (tape data.snap)]])]
    --
  ++  folder
    |%
    ++  list
      =,  enjs:format
      |=  folds=folders:engram
      ^-  json
      %-  pairs  %~  tap  in  
      ^-  (set [@t json])
      %-  ~(run in ~(key by folds))
      |=  id=id:engram
      =/  fold  (~(got by folds) id)
      :-  (spat ~[(scot %p -.id) (scot %u +.id)])
      (pairs ~[['name' (tape (trip name.fold))]])
    --
  --
--