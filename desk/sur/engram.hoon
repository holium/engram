|%
::
::  data types:
::  id:     currently frontend defined to allow for more freedom in indexing
::  edits:  a list of strings to contain the actual values that get shown in the editor
::  chg:    the object to contain the metadata required to display the information properly
::  hist:   list of changes that composes a document as well as its history
::  doc:    document metadata for indexing of different documents within the data structure
::
+$  id  @
+$  edits  (list @t)
+$  chg  [author=@p from=@ud to=@ud edit=edits type=@t]
+$  hist  (list chg)
+$  doc  [owner=@p id=id]
::
::  state:
::  docs:   a key-list container of document history for indexing values
::
+$  docs  (jar doc chg)
::
::  poke action:
::  %make:    create a new document with nil initiated values
::  %modify:  add a chg object to the beginning of the document data
::  %delete:  delete a document in the docs state
::
+$  action
  $%  [%make =doc]
      [%modify =doc =chg]
      [%delete =doc]
  ==
--