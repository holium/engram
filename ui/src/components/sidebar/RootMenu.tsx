import {useEffect, useState} from 'react'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function RootMenu(props){


    return(
        <menu
        className=" tree-menu context-menu select"
        style={{
          left: `${props.position.left}px`,
          top: `${props.position.top}px`,
        }}
        onMouseLeave={(e)=>props.setAppear(false)}
      >
        <li className = "justify-center" onClick={(e)=>{(props.setDoc(true)); props.setType("folder")}}>
                <i className="ri-folder-add-line "/>
                </li>
                    <li className = "justify-center" onClick={(e)=>{(props.setDoc(true)); props.setType("file")}}>
                <i className="ri-file-add-line"/>
                </li>
        </menu>
    )



}
export default RootMenu;