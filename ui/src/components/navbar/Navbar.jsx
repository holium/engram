import {VscSourceControl} from 'react-icons/vsc'
import {BiBell} from 'react-icons/bi'
import {HiOutlineUsers} from 'react-icons/hi'
import {FiSettings} from 'react-icons/fi'
import { useState, useContext} from "react";
import { GiHamburgerMenu } from 'react-icons/gi'
import { SlideContext } from './SlideContext'
import { light } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Navbar() {

    const [ fileName, setFileName ]= useState('file');
    const { slide, setSlide } = useContext(SlideContext);

    return(
    <div className=" topbar ">
                <FontAwesomeIcon icon={light('gear')} className = "icon"/>
                <FontAwesomeIcon icon={light('code-branch')} className = "icon"/>
                <FontAwesomeIcon icon={light('bell')} className = "icon" />
                <FontAwesomeIcon icon={light('user-group')} className = "icon"/>
            <div className=' mr-auto'>
                {fileName}
            </div>
        </div>
    )

}

export default Navbar;