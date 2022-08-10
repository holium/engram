
import { useEffect, useState} from "react";
import { light } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FolderMenu from "./FolderMenu";
function TreeComponent({ data }) {

    const [expand, setExpand] = useState(false);

    const [appear, setAppear] = useState(false);

    const [renameState, setrenameState] = useState(false);

    const [info, setInfo] = useState({
        label: data.label,
        isFolder: data.isFolder,
        children: data.children,
        editable: data.editable
})


useEffect(()=>{
    if(info.editable){
        setrenameState(true)
    }
},[])


    function ToggleFolderMenu(event) {
        event.stopPropagation();
        setAppear(!appear)
    }

    function deleteFolder(e) {
        e.stopPropagation()
        setInfo({label: null, isFolder: null, children: null});
    }

    function renameFolder(event) {
        event.stopPropagation();
        setrenameState(false);
        console.log("rename")
        //middleware

    }

    function addFile(e){
        e.stopPropagation()
        setInfo(previousInputs=>({...previousInputs, children: [...previousInputs.children,
            {     
             label: "NewFile",
             isFolder: "file", 
             editable:true
            },
        ]}))
        setExpand(true);
        
        console.log("added file")

    }

    function addFolder(e){
        e.stopPropagation()
        setInfo(previousInputs=>({...previousInputs, children: [...previousInputs.children,
            {     
             label: "NewFolder",
             isFolder: "folder", 
             children: [],
             editable:true
            },
        ]}))
        setExpand(true);

        console.log("added folder")

    }

    return(
        <div>
            <div className="icon-container" onClick={()=>setExpand(!expand)}>
            <div className='pr-2'>
            {info.isFolder === "folder" ? <FontAwesomeIcon icon={light('folder')} /> : info.isFolder === "file" ? <FontAwesomeIcon icon = {light('file')} /> : null}
            </div>
            {renameState ? 
            <div> 
            <input value = {info.label} onClick = {(e) =>(e.stopPropagation())} onChange ={(e)=>{
                setInfo(previousInputs => ({ ...previousInputs, label: e.target.value}))
            }} autoFocus/> 
            <FontAwesomeIcon icon = {light('check')} onClick ={(e)=>renameFolder(e)}/>
            </div>
            :
            <div> {info.label} </div>}
            <div className="icon" onClick={(e)=>ToggleFolderMenu(e)}>
            <FontAwesomeIcon icon={light('plus')} />
            </div>
            </div>
            {appear &&
            <FolderMenu ToggleFolderMenu = {ToggleFolderMenu} renameFolder = {setrenameState} deleteFolder = {deleteFolder} addFile = {addFile} addFolder = {addFolder} />
            }

         <div className = {`${expand ? "block" : " hidden"} pl-3`}>
            {info.isFolder === "folder" && info.children.map((childData) => (
                <TreeComponent data = {childData} />
            ))}
         </div>
    
        </div>
    )
    
    }
    
    export default TreeComponent