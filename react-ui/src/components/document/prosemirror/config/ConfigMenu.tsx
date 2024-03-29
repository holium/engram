import { useRef, useEffect } from "react";
import { addConfigTerm } from "./helpers";

function ConfigMenu(props: any) {
  const menuRef = useRef();

  function addTerm(term: any) {
    addConfigTerm(term.key, props.view, props.menu.state);
    props.hide();
  }

  function handleBlur() {
    props.hide();
  }

  useEffect(() => {
    (menuRef as any).current.focus();
  }, []);

  return (
    <menu
      tabIndex={0}
      ref={menuRef}
      className="configmenu context-menu select"
      style={{
        left: `${props.menu.left}px`,
        top: `${props.menu.top}px`,
        zIndex: "3",
      }}
      onBlur={handleBlur}
    >
      {props.menu.options.map((term) => {
        return (
          <li
            key={term.key}
            onClick={() => {
              addTerm(term);
            }}
          >
            {term.display}
          </li>
        );
      })}
    </menu>
  );
}

export default ConfigMenu;
