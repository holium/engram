/+  *mip
|%
+$  edits  (list @t)
+$  chg    [author=@p from=@ud to=@ud edit=edits type=@t]
+$  hist   (list chg)
::
+$  doc    [owner=@p id:@sw]
+$  docs   (jar doc hist)
::
+$  act
  $%  [%make =doc]
      [%modify =doc =chg]
      [%delete =doc]
  ==
