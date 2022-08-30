import { useEffect, useState} from "react";
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";

function TreeComponent({ data, onDelete, getChildren, handleAdd, handleRename}) {

    const [expand, setExpand] = useState(false);

    const [appear, setAppear] = useState(false);

    const [renameState, setrenameState] = useState(false);

    const [newDoc, setNewDoc] = useState("untitled");

    const [createChild, setCreateChild] = useState(false);

    const [pos, setPos] = useState({top: 0,
        left: 0
    });

    const [type, setType] = useState("");

    const [info, setInfo] = useState(
        data)

    const [children, setChildren] = useState([])

useEffect(()=>{
    if(!data.owner){
        setChildren(getChildren(info.children))
    } 
},[createChild])


const toggleAdd = (name) => {
    handleAdd(info.name, name, type)
    setChildren(getChildren(info.children))
    setExpand(true);
}

    function hideMenu(event){
        event.stopPropagation()
        setAppear(false)
        
    }

    const handleDelete = () => {
        onDelete(info.id);
        setInfo({id: null, name: null, children: []})
        setChildren([])
        setAppear(false);
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
            <div className="icon-container" onClick={(e)=>{setExpand(!expand); e.stopPropagation()}}>
            <div className="relative">
            <div className="absolute">
            {(info.owner || info.children.length == 0) ? "" : (!expand ? <i className="ri-arrow-right-s-line"></i> : <i className="ri-arrow-down-s-line"></i>)}
            </div>
            </div>
            
            <div className='pr-3 pl-4'>
            {info.id === null ? "" :(info.children ? <i className="ri-folder-line"></i> : <i className="ri-file-line"></i>)}
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
            }} autoFocus  onBlur={(e)=>{handleRename(info.id, info.name); setrenameState(false)}}/> 
            <i
              className="ri-checkbox-line icon clickable"
              onClick ={(e)=>{handleRename(info.id, info.name); setrenameState(false); e.stopPropagation()}}
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
            <FolderMenu ToggleFolderMenu = {ToggleFolderMenu} renameFolder = {setrenameState} onDelete = {handleDelete} id = {info.id} handleAdd = {toggleAdd} position = {pos} setCreateChild = {setCreateChild} setType = {setType}/> 
            : <FileMenu ToggleFolderMenu = {ToggleFolderMenu} renameFolder = {setrenameState} onDelete = {handleDelete} position = {pos}/> 
        ) }
            </menu>
        </div>

        {createChild && (
          <div className="flex px-4 py-1 gap-3">
            <input
              className="outline-none bg-none flex-grow outline rounded-1 px-2 py-1"
              style={{
                outlineColor: "var(--type-color)",
                outlineWidth: "1px",
                outlineOffset: "0",
                minWidth: "0",
              }}
              value={newDoc}
              onChange={(event) => {
                setNewDoc(event.target.value);
              }}
              onKeyPress={(event) => {
                console.log(event);
                if (event.key == "Enter") {event.stopPropagation(); handleAdd(info.id, newDoc, "folder"); setCreateChild(false); setExpand(true)}
                if (event.key == "Esc") {event.stopPropagation(); setCreateChild(false);}
              }}
            />
            <i onClick={(e)=>(e.stopPropagation(), handleAdd(info.id, newDoc, type), setCreateChild(false), setExpand(true))}
              className="ri-checkbox-line icon clickable"
            />
            <i onClick={(e)=>(e.stopPropagation(), setCreateChild(false))}
              className=" ri-close-line icon clickable"
            />
          </div>
        )}

         <div className = {`${expand ? "block" : " hidden"} pl-3`}>
            {info.children && children.map((childData) => (
                <div> 
                    <TreeComponent key ={childData.id} onDelete = {onDelete} data = {childData} getChildren = {getChildren} handleAdd = {handleAdd} handleRename = {handleRename}/>
                </div>
            ))}
         </div>
    
        </div>
    )
    
    }
    
    export default TreeComponent;
