import {useEffect, useState} from 'react'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FileMenu(props){


    return(
        <menu
        className=" tree-menu context-menu select"
        style={{
          left: `${props.position.left}px`,
          top: `${props.position.top}px`,
        }}
        onMouseLeave={(e)=>props.ToggleFolderMenu(e)}
      >
        <li className = " justify-center" onClick={(e)=>{
                    props.renameFolder(true)
                    props.ToggleFolderMenu(e)
                    }}>
                <i className="ri-edit-2-line" />
                    </li>
                    <li className = "justify-center" onClick = {(e)=>(
                    props.onDelete()
                )}>
                <i className="ri-delete-bin-line"/>
                </li>
        </menu>
    )



}
export default FileMenu;