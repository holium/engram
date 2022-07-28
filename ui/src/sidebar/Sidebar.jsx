import { useState } from "react"
import { GiHamburgerMenu } from 'react-icons/gi'
import DarkToggle from "../background/ThemeToggle";

function Sidebar() {

    const [sidebar, setSideBar] = useState(true);

    return(
        <div className=" bg-black dark:bg-slate-400  text-black duration-1000 relative flex">
            <div className= {`${sidebar ? " w-8" : " w-5"} duration-300`}>
                <GiHamburgerMenu className = " cursor-pointer rounded-3 absolute top-2 right-3" onClick={() => setSideBar(!sidebar)} />
        </div>
        </div>
        
    )

}

export default Sidebar;