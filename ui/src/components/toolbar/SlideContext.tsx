import { createContext, useState } from "react";

export const SlideContext = createContext();

function SlideProvider(props: any) {
  const [slide, setSlide] = useState(true);

  return (
    <SlideContext.Provider value={{ slide, setSlide }}>
      {props.children}
    </SlideContext.Provider>
  );
}

export default SlideProvider;
