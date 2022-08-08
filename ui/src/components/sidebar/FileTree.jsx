import { createContext, useState, useEffect } from "react";
import TreeComponent from "./TreeComponent";

function FileTree() {

    const [input, setInput] = useState({
        username:"",
        size: 0,
        users: []
    }
);


const data = {
  label: "root",
  isFolder: true,
  children: [
    {
     label: "hello",
     isFolder: false,
     children: [    
      {
      label: "hello2",
      isFolder: false,
      children: []
     },]
    },
  ],
  

}

    function addFile() {


    }

    function deleteFile() {

    }

    function addFolder() {

    }

    function deleteFolder() {

    }


return(

  <div>

    <TreeComponent data = {data}/>

  </div>

)

}

export default FileTree;