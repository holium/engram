import { createContext, useState, useEffect } from "react";
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';

function FileTree() {

    const [input, setInput] = useState({
        username:"",
        size: 0,
        users: []
    }
);

const items = {
    root: {
      index: 'root',
      hasChildren: true,
      children: ['child1', 'child2'],
      data: 'Root item',
    },
    child1: {
      index: 'child1',
      children: [],
      data: 'Child item 1',
    },
    child2: {
      index: 'child2',
      hasChildren: true,
      children: ['child3'],
      data: 'Child item 2',
    },
    child3: {
      index: 'child3',
      children: [],
      data: 'Child item 3',
    },
  };

    useEffect(
        ()=>{


        },
        [addFile, deleteFile]
    )

    function addFile() {


    }

    function deleteFile() {

    }

    function addFolder() {

    }

    function deleteFolder() {

    }


return(

    <UncontrolledTreeEnvironment
    dataProvider={new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }))}
    getItemTitle={item => item.data}
    viewState={{}}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

}

export default FileTree;