import { useContext, useState } from "react"
import { SlideContext } from "../navbar/SlideContext";
import {GiHamburgerMenu} from "react-icons/gi"
import FileTree from "./FileTree";


function Sidebar() {

    const { slide, setSlide } = useContext(SlideContext);

    return(
            <div className= {`${slide ? " w-8" : " w-5"} duration-300 relative`}>
                <FileTree/>
        </div>
        
    )

}

export default Sidebar;