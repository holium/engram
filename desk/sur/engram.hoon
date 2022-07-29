|%
+$  id  @
+$  edits  (list @t)
+$  chg  [author=@p from=@ud to=@ud edit=edits type=@t]
+$  hist  (list chg)
+$  doc  [owner=@p id=id]
+$  docs  (jar doc chg)
+$  action
  $%  [%make =doc]
      [%modify =doc =chg]
      [%delete =doc]
  ==
--