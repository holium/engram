/-  *engram
:: Index Logic & Functions
|%
++  delta
  |=  [state=index remote=version]
  ^-  iupdate
  ^*  iupdate
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
  |=  [state=index update=iupdate]
  ^-  index
  =/  newcontent
  %-  ~(run in ~(key by content.update))
  |=  client=@p
  %-  ~(run in (~(got by content.update) client))
  |=  item=[id type]
    =:  content.state  (~(put by content.state) -.item item)
        version.state  (~(put by version.state) client (add (~(got by version.state) client) 1))
      ==  
    state
  =/  newdels
  %-  ~(run in dels.update)
  |=  item=[id id]
    =:  dels.state  (~(put by dels.state) -.item +.item)
        version.state  (~(put by version.state) -.-.item (add (~(got by version.state) -.-.item) 1))
      ==  
    state
  state
++  insert
  |=  [state=index item=[id type] ship=@p]
  ^-  index
  =/  clock
  ?:  (~(has by version.state) ship)
    (add (~(got by version.state) ship) 1)
  0
  =:  content.state  (~(put by content.state) [ship clock] item)
      version.state  (~(put by version.state) ship clock)
    ==  
  state
++  delete
  |=  [state=index item=id ship=@p] 
  ^-  index
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
