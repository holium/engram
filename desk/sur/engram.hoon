/+  *mip
|%
::
::  Basic document structure
::  edits: list of strings to be processed via later declarations
::  chg:   a container of information describing a change in the document (author: individual who wrote the change, from: index of where the changes start, to: index of where the chagnes end, edits: list of modifications stored as a string, type: type of change)
::  hist:  a list of the changes on the document
::  doc:  metadata of the document for indexing (owner: the ship who created the document, id: a string ID -possibly UUID-)
::
+$  id  @
+$  edits  (list @t)
+$  chg    [author=@p from=@ud to=@ud edit=edits type=@t]
+$  hist   (list chg)
+$  doc    [owner=@p id=id doc=hist]
::
:: Poke actions
:: %make:   create the document via metadata and an empty hist
:: %modify: add a change to the document
:: %delete: remove the document
::
+$  action
  $%  [%make =doc]
      [%modify =doc =chg]
      [%delete =doc]
  ==
--
::
:: Update and scry
:: c-act: a cached action
:: %doc 
::
+$  update
  $%  action
      [%doc docs=(list doc)]
::
::  Basic state 
::  docs: a map of document changes indexed by the `doc` metadata and containing the list of changes `hist`.
::  cache: a collection of the actions performed on the state
::
+$  docs   (jar doc hist)
