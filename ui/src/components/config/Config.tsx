import React from "react";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../App.jsx"
import ConfigItem from "./ConfigItem.tsx"

import schema from "../document/build/schema.ts";

function Config(props) {

  const theme = useContext(ThemeContext);

  const [hidden, toggleHidden] = useState(true);

  function logJSON() {
    console.log(props.view.state.toJSON());
  }
  function addDescription() {
    const description = schema.nodes.description.create();
    for (let pos = 0; pos < 50; pos++) {
      const node = props.view.state.doc.nodeAt(pos);
      if (node && node.type.name == "description") {
        break;
      }
      const tr = props.view.state.tr.insert(pos, description);
      if (tr.docChanged) {
        props.view.dispatch(tr);
        break;
      }
    }
  }

  const configItems = [];
  Object.keys(theme.config).forEach((item) => {
    configItems.push(ConfigItem({key: item}))
  })

  return (
    <dl>
      {props.dev && (
        <li>
          <dt>devtools</dt>: <br />
          <dd>
            <button onClick={logJSON}>log json</button>
            <button onClick={addDescription}>add description</button>
          </dd>
        </li>
      )}
      {
        configItems
      }
    </dl>
  );
}

export default Config;
