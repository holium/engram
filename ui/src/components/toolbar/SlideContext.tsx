import { createContext, useState } from "react";

export const SlideContext = createContext(null);

function SlideProvider(props: any) {
  const small = window.innerWidth < 800;
  const [slide, setSlide] = useState(small);

  return (
    <SlideContext.Provider value={{ slide, setSlide, small }}>
      {props.children}
    </SlideContext.Provider>
  );
}

export default SlideProvider;
