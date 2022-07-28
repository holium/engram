import {VscSourceControl} from 'react-icons/vsc'
import {BiBell} from 'react-icons/bi'
import {HiOutlineUsers} from 'react-icons/hi'
import {FiSettings} from 'react-icons/fi'
import { useState } from "react";
import DarkToggle from '../background/ThemeToggle';

function Navbar() {

    const [ fileName, setFileName ]= useState('file');

    return(
    <div className=" bg-gray-50 dark:bg-slate-400 flex flex-row-reverse p-3 text-gray-400 dark:text-white duration-1000">
            <BiBell size = "1.7rem" className=" ml-2 mr-2"/>
            <VscSourceControl size = "1.7rem" className=" ml-2 mr-2"/>
            <HiOutlineUsers size = "1.7rem" className=" ml-2 mr-2"/>
            <FiSettings size = "1.7rem" className=" ml-2 mr-2"/>
            <div className="ml-2 mr-2">
                <DarkToggle/>
                </div>
            <div className=' mr-auto'>
                {fileName}
            </div>
        </div>
    )

}

export default Navbar;