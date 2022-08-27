import { useEffect, useState} from "react";
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";

function TreeComponent({ data, onDelete, setId, newDoc, getChildren, addFolder, addFile, handleAdd}) {
  const [expand, setExpand] = useState(false);

    const [appear, setAppear] = useState(false);

    const [renameState, setrenameState] = useState(false);

    const [createDoc, setCreateDoc] = useState(false);

    const [identifier, setIdentifier] = useState(false);

    const [pos, setPos] = useState({top: 0,
        left: 0
    });

    const [info, setInfo] = useState(
        data)

    const [children, setChildren] = useState([])

useEffect(()=>{
    if(newDoc === true){
        setrenameState(true)
    }

    if(!data.owner){
    setChildren(getChildren(info.children))
    } 

},[])

    function hideMenu(event){
        event.stopPropagation()
        setAppear(false)
        
    }

    const handleDelete = (prop) => {
        onDelete(prop);
        setId(null);
    }

    function ToggleFolderMenu(event) {
        event.stopPropagation();
        setAppear(!appear)
    }

    function renameFolder(event) {
        event.stopPropagation();
        setrenameState(false);
        console.log("rename")
        //middleware

    }

    return(
        <div>
            <div className="icon-container" onClick={()=>setExpand(!expand)}>
            <div className="relative">
            <div className="absolute">
            {(info.owner || info.children.length == 0) ? "" : (!expand ? <i className="ri-arrow-right-s-line"></i> : <i className="ri-arrow-down-s-line"></i>)}
            </div>
            </div>
            <div className='pr-3 pl-4'>
            {info.children ? <i className="ri-folder-line"></i> : <i className="ri-file-line"></i>}
            </div>
            {renameState ? 
            <div className="flex px-4 py-1 gap-3"> 
            <input
              className="outline-none bg-none flex-grow outline rounded-1 px-2 py-1"
              style={{
                outlineColor: "var(--type-color)",
                outlineWidth: "1px",
                outlineOffset: "0",
                minWidth: "0",
              }} 
              value = {info.name} onClick = {(e) =>(e.stopPropagation())} onChange ={(e)=>{
                setInfo(previousInputs => ({ ...previousInputs, name: e.target.value}))
            }} autoFocus  onBlur={(e)=>{renameFolder(e)}}/> 
            <i
              className="ri-checkbox-line icon clickable"
              onClick ={(e)=>renameFolder(e)}
            />
            <i
              className=" ri-close-line icon clickable"
            />
            </div>
            :
            <div> {info.name} </div>}
            <menu onMouseLeave={hideMenu}>
            { !renameState &&
            <div className="icons" onClick={(e)=>{ToggleFolderMenu(e); setPos({top: e.clientY, left: e.clientX});}}>
            <i className="ri-add-box-line clickable" ></i>
            </div>
            }
            {appear && (info.children ?
            <FolderMenu ToggleFolderMenu = {ToggleFolderMenu} renameFolder = {setrenameState} onDelete = {handleDelete} name = {info.name} handleAdd = {handleAdd} addFolder = {addFolder} position = {pos} /> 
            : <FileMenu ToggleFolderMenu = {ToggleFolderMenu} renameFolder = {setrenameState} deleteFolder = {onDelete} position = {pos}/> 
        ) }
            </menu>
        </div>

         <div className = {`${expand ? "block" : " hidden"} pl-3`}>
            {info.children && children.map((childData) => (
                <div> 
                    <TreeComponent key ={Math.random()} setId = {setIdentifier} onDelete = {onDelete} data = {childData} getChildren = {getChildren} handleAdd = {handleAdd}/>
                </div>
            ))}
         </div>
    
        </div>
    )
    
    }
    
    export default TreeComponent;
