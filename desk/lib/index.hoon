/-  *index
:: Index Logic & Functions
|%
++  index
  |$  item
  [version=version content=(map id item) dels=(map id id)]
++  update
  |$  item
  [content=(map id item) dels=(map id id)]
++  delta
  |*  [state=(index) remote=version]
  :-
  :: assembling the state map 
  %-  molt
  %+  turn
    %+  skim  ~(tap in ~(key by content.state))
    |=  item=id  ?|(!(~(has by remote) -.item) (gth +.item (~(got by remote) -.item)))
  |=  item=id  [item (~(got by content.state) item)]
  :: assembling the delete map 
  %-  molt
  %+  turn
    %+  skim  ~(tap in ~(key by dels.state))
    |=  item=id  ?|(!(~(has by remote) -.item) (gth +.item (~(got by remote) -.item)))
  |=  item=id  [item (~(got by dels.state) item)]
++  apply
  |*  [state=(index) updt=(update)]
  ^+  state
  =/  tdels  ~(tap in ~(key by (~(dif by dels.updt) dels.state)))
  =/  deleted  (silt (weld ~(val by dels.state) tdels))
  =/  tcont  
      %+  skim  ~(tap in (~(dif in ~(key by content.updt)) ~(key by content.state)))
      |=  key=id  !(~(has in deleted) key)
  =/  clients  ^*  (map @p (list id))
  =/  tcontres
  |-
    ?:  =((lent tcont) 0)
      tcont
    =/  item  (rear tcont)
    =/  nclients
    ?.  (~(has by clients) -.item)
      (~(put by clients) -.item ~[item])
    (~(put by clients) -.item (snoc (~(got by clients) -.item) item))
    %=  $
      clients  nclients
      tcont  (snip tcont)
    ==
  =/  tdelres
  |-
    ?:  =((lent tdels) 0)
      tdels
    =/  item  (rear tdels)
    ?.  (~(has by clients) -.item)
      %=  $
        clients  (~(put by clients) -.item ~[item])
        tdels  (snip tdels)
      ==
    %=  $
      clients  (~(put by clients) -.item (snoc (~(got by clients) -.item) item))
      tdels  (snip tdels)
    ==
  =/  clients  %-  ~(run by clients)  |=  cont=(list id)
    %+  sort  cont  |=  [a=id b=id]  (gth +.a +.b)
  |-
    ?:  =(~(wyt by clients) 0)
      state
    =/  client  (rear ~(tap in ~(key by clients)))
    =/  items   (~(got by clients) client)
    %=  $
      clients
      |-  
        ?:  =((lent items) 0)
          (~(del by clients) client)
        =/  item  (rear items)
        =/  idx  ?:  (~(has by version.state) client)  
          (add (~(got by version.state) client) 1)
        0
        ?:  =(idx +.item)
          :: insert
          ?:  (~(has by content.updt) item)
            :: insert new content
            =/  sample  (~(got by content.state) (rear ~(tap in ~(key by content.state))))
            =/  value  ^+  sample  (~(got by content.updt) item)
            %=  $
              content.state  (~(put by content.state) item value)
              version.state  (~(put by version.state) client idx)
              items          (snip items)
            ==
          ?:  (~(has by dels.updt) item)
            :: insert (& implement) new delete
            %=  $
              dels.state     (~(put by dels.state) item (~(got by dels.updt) item))
              content.state  (~(del by content.state) item)
              version.state  (~(put by version.state) client idx)
              items          (snip items)
            ==
          !!  :: should never get here; this means an item (from the update) can't be found in the update
        ?:  (~(has in deleted) [client idx])
          :: update the version but DONT snip
          %=  $
            version.state  (~(put by version.state) client idx)
          ==
        !! :: This time has not been deleted, nor does it exist in the update 
    ==
++  insert
  |*  [state=(index) item=* ship=@p]
  ^+  state
  =/  clock
  ?:  (~(has by version.state) ship)
    (add (~(got by version.state) ship) 1)
  0
  =:  content.state  (~(put by content.state) [ship clock] item)
      version.state  (~(put by version.state) ship clock)
    ==  
  state
++  remove
  |*  [state=(index) item=id ship=@p] 
  ^+  state
  =/  clock
  ?:  (~(has by version.state) ship)
    (add (~(got by version.state) ship) 1)
  0
  =:  dels.state     (~(put by dels.state) [ship clock] item)
      content.state  (~(del by content.state) item)
      version.state  (~(put by version.state) ship clock)
    ==  
  state
--
