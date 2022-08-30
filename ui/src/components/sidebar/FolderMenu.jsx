import {useEffect, useState} from 'react'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FolderMenu(props){


    const [rename, setRename] = useState("")

    


    return(

        <menu
        className="tree-menu context-menu select"
        style={{
          left: `${props.position.left}px`,
          top: `${props.position.top}px`,
        }}
        onMouseLeave={(e)=>props.ToggleFolderMenu(e)}
      >
        <li className = "justify-center" onClick = {(e)=>(
                    e.stopPropagation(), props.setType("folder"), props.setCreateChild(true))
                }>
                <i className="ri-folder-add-line "/>
                </li>
                <li className = "justify-center" onClick = {(e)=>(e.stopPropagation(), props.setType("file"), props.setCreateChild(true))}>
                <i className="ri-file-add-line"/>
                </li>
                <li className = "justify-center" onClick={(e)=>{
                    props.renameFolder(true)
                    props.ToggleFolderMenu(e)
                    }}>
                <i className="ri-edit-2-line "/>
                    </li>
                    <li className = "justify-center" onClick = {()=>{
                    console.log(props)
                    props.onDelete();
                    }
                }>
                <i className="ri-delete-bin-line"/>
                </li>
        </menu>

    )



}
export default FolderMenu;