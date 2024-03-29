import { createContext, useState } from "react";

export const SlideContext = createContext(null);

function SlideProvider(props: any) {
  const [slide, setSlide] = useState(window.innerWidth < 800);

  return (
    <SlideContext.Provider value={{ slide, setSlide }}>
      {props.children}
    </SlideContext.Provider>
  );
}

export default SlideProvider;
