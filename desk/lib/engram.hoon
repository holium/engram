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
    :~  
      [%leave (ot ~[self+(se %p)])]
      :-  %document  %-  of  :~  
        [%make (ot ~[owner+(se %p) name+so space+pa content+sa version+sa roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
        [%delete (ot ~[id+pa])]
        [%save (ot ~[id+pa content+sa version+sa])]
        [%snap (ot ~[id+pa snapshot+(ot ~[timestamp+di author+(se %p) content+sa])])]
        [%rename (ot ~[id+pa name+so])]
        [%addperm (ot ~[id+pa perm+so level+(se %tas) type+(se %tas)])]
        [%removeperm (ot ~[id+pa timestamp+pa type+(se %tas)])]
        [%update (ot ~[id+pa])]
        [%gatherall (ot ~[id+pa])]
        [%gather (ot ~[id+pa peer+(se %p)])]
        [%accept (ot ~[id+pa])]
      ==
      :-  %folder  %-  of  :~
        [%make (ot ~[owner+(se %p) name+so space+pa roles+(op sym (se %tas)) ships+(op fed:ag (se %tas))])]
        [%delete (ot ~[id+pa])]
        [%rename (ot ~[id+pa name+so])]
        [%addperm (ot ~[id+pa perm+so level+(se %tas) type+(se %tas)])]
        [%removeperm (ot ~[id+pa timestamp+pa type+(se %tas)])]
        [%add (ot ~[to+pa id+pa type+so])]
        [%remove (ot ~[from+pa id+pa])]
        [%update (ot ~[id+pa])]
        [%gatherall (ot ~[id+pa])]
      ==
      :-  %space  %-  of  :~
        [%make (ot ~[space+pa])]
        [%addperm (ot ~[space+pa perm+so level+(se %tas) type+(se %tas)])]
        [%removeperm (ot ~[space+pa timestamp+pa type+(se %tas)])]
        [%update (ot ~[space+pa])]
        [%gatherall (ot ~[space+pa])]
      ==
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
    ++  content
      =,  enjs:format
      |=  [docs=documents:engram fols=folders:engram items=(map id:index [id:index @tas])]
      ^-  json
      %-  pairs
      %+  turn  
        %+  skim  ~(val by items)  
        |=  [id=id:index type=@tas]
        ?+  type  %.n
          %document  (~(has by docs) id)
          %folder    (~(has by fols) id)
        ==
      |=  [id=id:index type=@tas]
      ?+  type  !!
          %document
        :-  (spat ~[(scot %p -.id) (scot %u +.id)])
        ?.  (~(has by docs) id)
          (pairs ~[['type' (tape "document")] ['name' (tape "Missing Document")] ['owner' (tape "Missing Document")]])
        =/  doc  (~(got by docs) id)
        %-  pairs 
          :~  ['id' (path ~[(scot %p -.id) (scot %u +.id)])]
              ['type' (tape "document")] 
              ['name' (tape (trip name.settings.doc))] 
              ['space' (path space.settings.doc)]
              ['owner' (tape (scow %p owner.settings.doc))]
              :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.settings.doc)
                |=  [id=id:index [role=@tas level=@tas]]
                [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
              :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.settings.doc)
                |=  [id=id:index [ship=@p level=@tas]]
                [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
          ==
          %folder
        :-  (spat ~[(scot %p -.id) (scot %u +.id)])
        ?.  (~(has by fols) id)
          (pairs ~[['type' (tape "folder")] ['name' (tape "Missing Folder")] ['owner' (tape "Missing Folder")] ['children' (pairs [~])]])
        =/  fol  (~(got by fols) id)
        =/  folcont  %-  ~(rut by content.content.fol)  
          |=  [key=id:index v=[id=id:index type=@tas]]  
          [(spat ~[(scot %p -.key) (scot %u +.key)]) (pairs ~[['id' (path ~[(scot %p -.id.v) (scot %u +.id.v)])] ['type' (tape (trip type.v))]])]
        %-  pairs 
          :~  ['id' (path ~[(scot %p -.id) (scot %u +.id)])]
              ['type' (tape "folder")] 
              ['name' (tape (trip name.fol))] 
              ['children' (pairs ~(val by folcont))]
              ['owner' (tape (scow %p owner.fol))]
              :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.fol)  
                |=  [id=id:index [ship=@p level=@tas]]  
                [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
              :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.fol)  
                |=  [id=id:index [role=@tas level=@tas]]  
                [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
          ==
      ==
    ++  list
      =,  enjs:format
      |=  spc=space:engram
      ^-  json
      %-  pairs  
      %+  turn  ~(tap by content.content.spc)
      |=  [key=id:index v=[id=id:index type=@tas]]
      [(crip (stringify:index key)) (pairs ~[['id' (tape (stringify:index id.v))] ['type' (tape (trip type.v))]])]
    ++  perms
      =,  enjs:format  
      |=  spc=space:engram
      ^-  json
      %-  pairs  :~
        :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.spc)
          |=  [id=id:index [role=@tas level=@tas]]
          [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
        :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.spc)
          |=  [id=id:index [ship=@p level=@tas]]
          [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
      ==
    --
  ++  document
    |%
    ++  listall
      =,  enjs:format
      |=  docs=documents:engram
      ^-  json
      %-  pairs  %~  tap  in  
      ^-  (set [@t json])
      %-  ~(run in ~(key by docs))
      |=  id=id:engram
      =/  doc  (~(got by docs) id)
      :-  (spat ~[(scot %p -.id) (scot %u +.id)])  (tape (trip name.settings.doc))
    ++  get
      =,  enjs:format
      |=  doc=document:engram
      ^-  json
      %-  pairs  :~ 
        ['id' (path ~[(scot %p -.id.doc) (scot %u +.id.doc)])]
        ['name' (tape (trip name.settings.doc))]
        ['owner' (tape (scow %p owner.settings.doc))]
        ['version' (tape version.doc)]
        ['content' (tape content.doc)]
        :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.settings.doc)
          |=  [id=id:index [role=@tas level=@tas]]
          [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
        :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.settings.doc)
          |=  [id=id:index [ship=@p level=@tas]]
          [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
      ==
    ++  meta
      =,  enjs:format
      |=  doc=document:engram
      ^-  json
      %-  pairs  :~ 
        ['id' (path ~[(scot %p -.id.doc) (scot %u +.id.doc)])]
        ['type' (tape "document")]
        ['name' (tape (trip name.settings.doc))]
      ==
    ++  perms
      =,  enjs:format
      |=  settings=dsettings:engram
      ^-  json
      %-  pairs  :~
        ['space' (path space.settings)]
        ['owner' (tape (scow %p owner.settings))]
        :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.settings)  
          |=  [id=id:index [ship=@p level=@tas]]  
          [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
        :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.settings)  
          |=  [id=id:index [role=@tas level=@tas]]  
          [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
      ==
    ++  content
      =,  enjs:format
      |=  [doc=document:engram updts=(list dupdate:engram)]
      ^-  json
      %-  pairs  :~
        ['content' (tape content.doc)]
        :-  'updates'  %-  pairs
          %+  turn  updts
          |=  updt=dupdate:engram
          [(scot %da timestamp.updt) (pairs ~[['author' (tape (scow %p author.updt))] ['content' (tape content.updt)]])]
      ==
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
      |=  fold=folder:engram
      ^-  json
      %-  pairs  
      %+  turn  ~(tap by content.content.fold)
      |=  [key=id:index v=[id=id:index type=@tas]]
      [(crip (stringify:index key)) (pairs ~[['id' (tape (stringify:index id.v))] ['type' (tape (trip type.v))]])]
    ++  meta
      =,  enjs:format
      |=  fol=folder:engram
      ^-  json
      =/  folcont  %-  ~(rut by content.content.fol)  
          |=  [key=id:index v=[id=id:index type=@tas]]  
          [(spat ~[(scot %p -.key) (scot %u +.key)]) (pairs ~[['id' (path ~[(scot %p -.id.v) (scot %u +.id.v)])] ['type' (tape (trip type.v))]])]
      %-  pairs  :~
        ['id' (path ~[(scot %p -.id.fol) (scot %u +.id.fol)])]
        ['type' (tape "folder")]
        ['name' (tape (trip name.fol))]
        ['children' (pairs ~(val by folcont))]
      ==
    ++  perms
      =,  enjs:format
      |=  fol=folder:engram
      ^-  json
      %-  pairs  :~
        ['owner' (tape (scow %p owner.fol))]
        :-  'ships'  %-  pairs  %+  turn  ~(tap by content.ships.fol)  
          |=  [id=id:index [ship=@p level=@tas]]  
          [(crip (stringify:index id)) (pairs ~[['ship' (tape (trip (scot %p ship)))] ['level' (tape (trip level))]])]
        :-  'roles'  %-  pairs  %+  turn  ~(tap by content.roles.fol)  
          |=  [id=id:index [role=@tas level=@tas]]  
          [(crip (stringify:index id)) (pairs ~[['role' (tape (trip role))] ['level' (tape (trip level))]])]
      ==
    --
  --
++  guardspace
  |=  [space=path roles=(map @tas @tas) ships=(map @p @tas) levels=(set @tas) peer=@p our=@p now=@da]
  ^-  @f
  =/  memberdata  .^(view:membership %gx `path`~[(scot %p our) ~.spaces (scot %da now) -.space -.+.space ~.members (scot %p peer) ~.noun])
  ?|
    :: Checking Ownership
    ?+  -.memberdata  !!
        %member
      (~(has in roles.member.memberdata) %owner)
    ==
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