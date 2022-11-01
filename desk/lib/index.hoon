/-  *engram
:: Index Logic & Functions
|%
++  delta
  |=  state=index remote=verion
  ^-  iupdate
  =/  dstate
    %-  ~(rut by version.state)
    |=  [client=@p clk=@u]
    =/  rclk  (~(get by remote) client)
    ?:  (lth rclk clk)
      %-  silt
      %-  murn  ~(tap by content.state)
      |=  [key=id value=[id type]]
      ?:  (gth +.key rclk)
        value
      ~
    (silt ~[])
  =/  ddels
    %-  silt
    %-  murn  ~(tap by dels.state)
    |=  [timestamp=id item=id]
    ?:  (lth (~(get by remote) -.timestamp) +.timestamp)
      [timestamp item]
    ~
  [dstate ddels]
++  apply
  |=  state=index update=iupdate
  ^-  index
  =/  newcontent
  %-  ~(run in ~(key by content.update))
  |=  client=@p
  %-  ~(run in (~(get by content.update) client))
  |=  item=[id type]
    (~(put by content.state) id.item item)
    (~(put by version.state) client (add (~(get by version.state) client) 1))
    item
  =/  newdels
  %-  ~(run in dels.update)
  |=  item=[id id]
    (~(put by dels.state) -.item +.item)
    (~(put by version.state) -.-.item (add (~(get by version.state) -.-.item) 1))
    item
  state
++  add
  |=  state=index  item=[id type]
  ^-  index
  %-  ~(put by content.state)  [our (add (~(get by version.state) our) 1)]  item
  %-  ~(put by version.state)  our  (add (~(get by version.state) out) 1)
  state
++  delete
  |=  state=index  item=id
  ^-  index
  =/  dels     %-  ~(put by dels.state)  [our (add (~(get by version.state) our) 1)]  id
  =/  content  %-  ~(del by content.state)  id
  =/  version  %-  ~(put by version.state)  our  (add (~(get by version.state) out) 1)
  [version content dels]
--
