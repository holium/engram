import {VscSourceControl} from 'react-icons/vsc'
import {BiBell} from 'react-icons/bi'
import {HiOutlineUsers} from 'react-icons/hi'
import {FiSettings} from 'react-icons/fi'
import { useState, useContext} from "react";
import { GiHamburgerMenu } from 'react-icons/gi'
import { SlideContext } from '../navbar/SlideContext'

function Navbar() {

    const [ fileName, setFileName ]= useState('file');
    const { slide, setSlide } = useContext(SlideContext);

    return(
    <div className=" bg-gray-50 dark:bg-slate-400 flex flex-row-reverse p-3 text-gray-400 dark:text-white duration-1000">
            <FiSettings size = "1.7rem" className=" ml-2 mr-2"/>
            <BiBell size = "1.7rem" className=" ml-2 mr-2"/>
            <VscSourceControl size = "1.7rem" className=" ml-2 mr-2"/>
            <HiOutlineUsers size = "1.7rem" className=" ml-2 mr-2"/>
                <GiHamburgerMenu size = "1.7rem" className = "ml-2 mr-2 cursor-pointer" onClick={() => setSlide(!slide)} />
            <div className=' mr-auto'>
                {fileName}
            </div>
        </div>
    )

}

export default Navbar;