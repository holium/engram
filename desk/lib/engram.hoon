/-  engram
/-  index
/-  membership
/+  index
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
          [%delete (ot ~[id+pa])]
          [%save (ot ~[id+pa content+sa version+sa])]
          [%snap (ot ~[id+pa snapshot+(ot ~[timestamp+di author+(se %p) data+sa])])]
          [%rename (ot ~[id+pa name+so])]
          [%addship (ot ~[id+pa ship+(se %p) level+(se %tas)])]
          [%addrole (ot ~[id+pa role+(se %tas) level+(se %tas)])]
          [%gatherall (ot ~[id+pa])]
          [%accept (ot ~[id+pa update+(ot ~[author+(se %p) timestamp+(se %da) content+sa])])]
      ==
      :-  %folder  %-  of  :~
        [%make (ot ~[owner+(se %p) name+so space+pa roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
        [%delete (ot ~[id+pa])]
        [%rename (ot ~[id+pa name+so])]
        [%add (ot ~[to+pa id+pa type+so])]
        [%remove (ot ~[from+pa id+pa])]
        [%gatherall (ot ~[id+pa])]
      ==
      :-  %space  %-  of  :~
        [%make (ot ~[space+pa])]
        [%gatherall (ot ~[space+pa])]
      ==
      :::-  %prop  %-  of  :~
      ::  [%accept (ot ~[id+pa update+(ot ~[author+(se %p) timestamp+di content+sa])])]
      ::  [%sub (ot ~[id+pa ship+(se %p)])]
      ::  [%unsub (ot ~[ship+(se %p)])]
      ::  [%update-live (ot ~[id+pa update+(ot ~[author+(se %p) timestamp+di content+sa])])]
      ::==
    ==
  --
++  enjs
  |%
  ++  timestamp
    =,  enjs:format
    |=  timestamp=id:engram
    ^-  json
    (path ~[(scot %p -.timestamp) (scot %u +.timestamp)])
  ++  space
    |%
    ++  list
      =,  enjs:format
      |=  [docs=documents:engram fols=folders:engram items=(map id:index [id:index @tas])]
      ^-  json
      %-  pairs  %~  val  by  
      ^-  (map id:index [@t json])
      %-  ~(run by items)
      |=  [id=id:index type=@tas]
      ?:  =(type %document)
        =/  doc  (~(got by docs) id)
        :-  (spat ~[(scot %p -.id) (scot %u +.id)])
        (pairs ~[['type' (tape "document")] ['name' (tape (trip name.settings.doc))] ['owner' (tape (scow %p owner.settings.doc))]])
      =/  fol  (~(got by fols) id)
      =/  folcont  %-  ~(rut by content.content.fol)  
        |=  [key=id:index v=[id=id:index type=@tas]]  
        [(spat ~[(scot %p -.key) (scot %u +.key)]) (pairs ~[['id' (path ~[(scot %p -.id.v) (scot %u +.id.v)])] ['type' (tape (trip type.v))]])]
      :-  (spat ~[(scot %p -.id) (scot %u +.id)])
      (pairs ~[['type' (tape "folder")] ['name' (tape (trip name.fol))] ['owner' (tape (scow %p owner.fol))] ['content' (pairs ~(val by folcont))]])
    ++  settings
      =,  enjs:format  
      |=  spc=space:engram
      ^-  json
      %-  pairs  :~
        :-  'roles'  %-  pairs  %+  turn  ~(val by content.roles.spc)
          |=  [role=@tas level=@tas]
          [(crip (trip role)) (tape (trip level))]
        :-  'ships'  %-  pairs  %+  turn  ~(val by content.ships.spc)
          |=  [ship=@p level=@tas]
          [(scot %p ship) (tape (trip level))]
      ==
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
        :: Alvin Zhou
        :: Ethan Chabowski
        :: Binging with Bavish
        :: Uncle Roger
        ['id' (path ~[(scot %p -.id.doc) (scot %u +.id.doc)])]
        ['version' (tape version.doc)]
        ['content' (tape content.doc)]
        :::-  'ships'  %-  pairs  %+  turn  ~(val by content.ships.settings.doc)  |=  [ship=@p level=@tas]  [(scot %p ship) (tape (trip level))]
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
        :-  'ships'  %-  pairs  %+  turn  ~(val by content.ships.settings)  |=  [ship=@p level=@tas]  [(scot %p ship) (tape (trip level))]
        :-  'roles'  %-  pairs  %+  turn  ~(val by content.roles.settings)  |=  [role=@tas level=@tas]  [(crip (trip role)) (tape (trip level))]
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
        [(scot %da timestamp.snap) (pairs ~[['author' (tape (scow %p author.snap))] ['timestamp' (time timestamp.snap)] ['content' (tape data.snap)]])]
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
++  guardspace
  |=  [space=path roles=(map @tas @tas) ships=(map @p @tas) levels=(set @tas) peer=@p our=@p now=@da]
  ^-  @f
  =/  memberdata  .^(view:membership %gx `path`~[(scot %p our) ~.spaces (scot %da now) -.space -.+.space ~.members (scot %p peer) ~.noun])
  ?|
    :: Checking ships
    ?&  (~(has by ships) peer)  
        (~(has in levels) (~(got by ships) peer))
    ==
    :: Checking roles
    ?+  -.memberdata  !!
        %member
      %-  ~(rep in roles.member.memberdata)
        |=  [a=@tas b=@f]
        ?:  ?|(=(a %owner) b)  %.y
        ?.  (~(has by roles) a)  b
        (~(has in levels) (~(got by roles) a))
    ==
  ==
--