/-  *index
:: Index Logic & Functions
|%
++  index
  |$  item
  [version=version content=(map id item) dels=(map id id)]
++  update
  |$  item
  [content=(map @p (set [id item])) dels=(set [id id])]
++  delta
  |=  [state=index remote=version]
  ^-  update
  ^*  update
  ::=/  dstate
  ::  %-  ~(rut by version.state)
  ::  |=  [client=@p clk=@u]
  ::  =/  rclk  (~(got by remote) client)
  ::  ?:  (lth rclk clk)
  ::    ^-  (set [id type])
  ::    %-  silt
  ::    ^-  (list [id type])
  ::    %+  murn  ~(tap by content.state)
  ::    |=  [key=id value=[id type]]
  ::    ?:  (gth +.key rclk)
  ::      value
  ::    ~
  ::  ^*  set
  ::=/  ddels
  ::  %-  silt
  ::  %+  murn  ~(tap by dels.state)
  ::  |=  [timestamp=id item=id]
  ::  ?:  (lth (~(got by remote) -.timestamp) +.timestamp)
  ::    [timestamp item]
  ::  ~
  ::[dstate ddels]
++  apply
  |=  [state=(index) update=(update)]
  ^-  (index)
  =/  nstate  state
  =/  clients  ~(tap in ~(key by content.update))
  =/  nstate
  |-
    =/  client  (rear clients)
    ?:  =((lent clients) 0)
        nstate
    =/  additions  %+  sort  ~(tap in (~(got by content.update) client))  |=  [a=[=id *] b=[=id *]]  (gth +.id.a +.id.b)
    =/  nstate
    |-
      ?:  =((lent additions) 0)
        nstate
      =/  addition  (rear additions)
      %=  $
        content.nstate  (~(put by content.nstate) -.addition +.addition)
        version.nstate  (~(put by version.nstate) client (add (~(got by version.nstate) client) 1))
        additions  (snip additions)
      ==
    %=  $
      clients  (snip clients)
    ==
  =/  dels  ~(tap in dels.update)
  =/  nstate
  |-
    ?:  =((lent dels) 0)
      nstate
    =/  del  (rear dels)
    =/  nversion  (~(put by version.nstate) -.+.del (add (~(got by version.nstate) -.+.del) 1))
    =/  delversion  (~(put by version.nstate) -.-.del (add (~(got by version.nstate) -.-.del) 1))
    %=  $
      dels.nstate  (~(put by dels.nstate) -.del +.del)
      version.nstate  delversion
      dels  (snip dels)
    ==
  nstate
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
