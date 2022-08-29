import { createContext, useState, useEffect } from "react";
import TreeComponent from "./TreeComponent";


function FileTree() {

    const [input, setInput] = useState({
        label:"root",
        isFolder: false,
        children: []
    }
);


const data = {
  label: "root",
  isFolder: "folder",
  children: [
    {
     label: "hello",
     isFolder: "folder",
     children: [    
      {
      label: "hello2",
      isFolder: "file", 
     },]
    },
  ],
  

}



return(

  <div>
    

    <TreeComponent data = {data}/>

  </div>

)

}

export default FileTree;