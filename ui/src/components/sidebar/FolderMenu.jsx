import {useEffect, useState} from 'react'
import { light } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FolderMenu(props){


    const [rename, setRename] = useState("")

    


    return(
        <div className="flex justify-between" onMouseLeave={(e)=>props.ToggleFolderMenu(e)}>
                <FontAwesomeIcon icon = {light('folder-plus')} onClick = {(e)=>(
                    props.addFolder(e)
                )}/>
                <FontAwesomeIcon icon = {light('file-circle-plus') } onClick = {(e)=>(props.addFile(e))}/>
                <FontAwesomeIcon icon = {light('input-text')} className = " rounded-1 hover:bg-gray-400"onClick={(e)=>{
                    props.renameFolder(true)
                    props.ToggleFolderMenu(e)
                    }}/>
                <FontAwesomeIcon icon = {light('trash-can')} onClick = {(e)=>(
                    props.deleteFolder(e)
                )}/>


        </div>
    )



}
export default FolderMenu;