import { BsFolder } from 'react-icons/bs'
import { useState } from "react";
import { BsFileText } from 'react-icons/bs'
function TreeComponent({ data }) {

    const [expand, setExpand] = useState(false);

    return(
        <div>
         <div className='flex'
         onClick={()=>setExpand(!expand)}>
            <div className='pr-2'>
            {data.isFolder ? <BsFolder/> : <BsFileText/>}
            </div>
            {data.label}
         </div>

         <div className = {`${expand? "block" : " hidden"} pl-3`}>
            {data.children.map((childData) => (
                <TreeComponent data = {childData}/>
            ))}
         </div>
    
        </div>
    )
    
    }
    
    export default TreeComponent