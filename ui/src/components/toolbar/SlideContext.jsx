import { createContext, useState} from "react";


export const SlideContext = createContext();

function SlideProvider({children}) {

    const [slide, setSlide] = useState(true)


    return(
        <SlideContext.Provider value = {{slide, setSlide}}>
            {children}
        </SlideContext.Provider>
    )
};

export default SlideProvider;