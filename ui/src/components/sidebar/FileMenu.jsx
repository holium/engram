import {useEffect, useState} from 'react'
import { light } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FileMenu(props){


    return(
        <menu
        className="tree-menu context-menu select"
        style={{
          left: `${props.position.left}px`,
          top: `${props.position.top}px`,
        }}
        onMouseLeave={(e)=>props.ToggleFolderMenu(e)}
      >
                <FontAwesomeIcon className = "clickable" icon = {light('input-text')} onClick={(e)=>{
                    props.renameFolder(true)
                    props.ToggleFolderMenu(e)
                    }}/>
                <FontAwesomeIcon className = "clickable" icon = {light('trash-can')} onClick = {(e)=>(
                    props.deleteFolder(e)
                )}/>


        </menu>
    )



}
export default FileMenu;