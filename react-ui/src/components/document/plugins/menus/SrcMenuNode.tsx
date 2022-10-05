import { toggleMark } from "prosemirror-commands";
import { useState } from "react";

function SrcMenu(props) {
  const [value, setValue] = useState(props.menu.node.attrs.src);

  function handleChange(event) {
    setValue(event.target.value);
    const tr = props.view.state.tr.setNodeMarkup(props.menu.from, null, {
      src: event.target.value,
    });
    props.view.dispatch(tr);
  }

  return (
    <div
      className="highlightmenu"
      style={{
        left: `${props.menu.left}px`,
        top: `calc(${props.menu.top}px - 3em)`,
      }}
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="px-3 py-2"
        style={{ width: "60ch" }}
      />
    </div>
  );
}

export default SrcMenu;
