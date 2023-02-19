/-  *index
:: Index Logic & Functions
|%
++  index
  |$  item
  [version=version content=(map id item) dels=(map id id)]
++  update
  |$  item
  [content=(map id item) dels=(map id id)]
++  stringify
  |=  id=id
  (weld (weld "/" (trip (scot %p -.id))) (weld "/" (trip (scot %ud +.id))))
++  pathify
  |=  id=id
  (weld (trip (scot %p -.id)) (weld "-" (trip (scot %ud +.id))))
++  enjs
  |=  indx=(index json)
  =,  enjs:format
  ^-  json
  %-  pairs
    :~  :-  'version'
          %-  pairs  %+  turn  ~(tap by version.indx)
            |=  [ship=@p clk=@ud]
            [(scot %p ship) (numb clk)]
        :-  'content'
          %-  pairs  %+  turn  ~(tap by content.indx)
            |=  [id=id:index item=json]
            [(crip (stringify:index id)) item]
        :-  'dels'
          %-  pairs  %+  turn  ~(tap by dels.indx)
            |=  [id=id:index item=id:index]
            [(crip (stringify:index id)) (tape (stringify:index id))]
    ==
++  dejs
  |=  jon=json
  =,  dejs:format
  ^-  (index json)
  =/  parsed  %.  jon
    (ot ~[version+(om ni) content+(om sa) dels+(om pa)])
  =/  version  %-  molt  %+  turn  ~(tap by -.parsed)  
      |=  [ship=@t clk=@ud]
      [(slav %p ship) clk]
  =/  content  %-  molt  %+  turn  ~(tap by -.+.parsed)  
      |=  [id=@t item=tape]
      =/  p  (stab id)
      [[(slav %p -.p) (slav %ud -.+.p)] (tape:enjs:format item)]
  =/  dels  %-  molt  %+  turn  ~(tap by +.+.parsed)  
      |=  [tmstamp=@t id=path]
      =/  t  (stab tmstamp)
      [[(slav %p -.t) (slav %ud -.+.t)] [(slav %p -.id) (slav %ud -.+.id)]]
  [version content dels]
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
  =/  ldels  ~(val by (~(dif by dels.updt) dels.state))
  =/  deleted  (silt (weld ~(val by dels.state) ldels))
  =/  lcont  
      %+  skim  ~(tap in (~(dif in ~(key by content.updt)) ~(key by content.state)))
      |=  key=id  !(~(has in deleted) key)
  =/  lcomplete  (weld ~(tap in ~(key by (~(dif by dels.updt) dels.state))) lcont)
  =/  clients  %-  %~  rut  by  %-  molt
      %+  turn  lcomplete  |=  item=id  [-.item %.y]
    |=  [peer=@p =%.y]
      %+  sort  %+  skim  lcomplete
        |=  item=id  =(-.item peer)
      |=  [a=id b=id]  (gth +.a +.b)
  =/  res
  |-
    ?:  =(~(wyt by clients) 0)
      state
    =/  client  (rear ~(tap in ~(key by clients)))
    =/  items   (~(got by clients) client)
    %=  $
      state
      |-  
        ?:  =((lent items) 0)
          state
        =/  item  (rear items)
        =/  idx  ?:  (~(has by version.state) client)
          (add (~(got by version.state) client) 1)
        0
        ?:  ?&(=(idx +.item) !(~(has in deleted) [client idx]))
          :: insert
          ?:  (~(has by content.updt) item)
            :: insert new content
            =/  value  (~(got by content.updt) item)
            =/  nstate
            =:  content.state  (~(put by content.state) item value)
                version.state  (~(put by version.state) client idx)
              ==
            state
            =/  contres
            %=  $
              state  nstate
              items  (snip items)
            ==
            contres
          ?:  (~(has by dels.updt) item)
            :: insert (& implement) new delete
            =/  nstate
            =:  dels.state     (~(put by dels.state) item (~(got by dels.updt) item))
                content.state  (~(del by content.state) (~(got by dels.updt) item))
                version.state  (~(put by version.state) client idx)
              ==
            state
            %=  $
              state  nstate
              items  (snip items)
            ==
          ~&  "Can't find: {<item>} in:"  
          ~&  dels.updt  !!  :: should never get here; this means an item (from the update) can't be found in the update
        ?:  (~(has in deleted) [client idx])
          :: update the version but DONT snip
          =/  nstate
          =:  version.state  (~(put by version.state) client idx)
            ==
          state 
          %=  $
            state  nstate
            items  items
          ==
        ~&  "Missing: [{<client>} {<idx>}] from:"
        ~&  deleted  
        !! :: This time has not been deleted, nor does it exist in the update 
      clients  (~(del by clients) client)
    ==
  res
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
