import React from "react";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../App.jsx"
import ConfigItem from "./ConfigItem.tsx"

import schema from "./build/schema.ts";

function Config(props) {

  const { theme } = useContext(ThemeContext);

  const [hidden, toggleHidden] = useState(true);

  /* Config Fields ---------------------------------------------------------- */
  /*
  // Type
  const [frequency, setFrequency] = useState(props.config.frequency);
  const [ratio, setRatio] = useState(props.config.ratio);
  // Colour
  const [paperColor, setPaperColor] = useState(props.config.paperColor)
  const [typeColor, setTypeColor] = useState(props.config.typeColor)
  const [offColor, setOffColor] = useState(props.config.offColor)
  // Width
  const [docWidth, setDocWidth] = useState(props.config.docWidth);
  */

  /* Panel Hanlders --------------------------------------------------------- */
  /*
  // Type
  const handleFrequency = (event) => {
    setFrequency(event.target.value);
  };
  const handleRatio = (event) => {
    setRatio(event.target.value);
  };
  // Color
  const handlePaperColor = (event) => {
    setPaperColor(event.target.value);
  };
  const handleTypeColor = (event) => {
    setTypeColor(event.target.value);
  };
  const handleOffColor = (event) => {
    setOffColor(event.target.value)
  }
  // Width
  const handleDocWidth = (event) => {
    setDocWidth(event.target.value);
  };
  */

  /* Config Implementation -------------------------------------------------- */
  /*
  // Type
  const implementFrquency = () => {
    (document.body).style.setProperty(
      "--frequency",
      `${frequency / 16}em`
    );
  };
  const implementRatio = () => {
    (document.body).style.setProperty(
      "--title",
      `${ratio ** (4 / 3)}em`
    );
    (document.body).style.setProperty(
      "--h1",
      `${ratio ** (3 / 3)}em`
    );
    (document.body).style.setProperty(
      "--h2",
      `${ratio ** (2 / 3)}em`
    );
    (document.body).style.setProperty(
      "--h3",
      `${ratio ** (1 / 3)}em`
    );
    (document.body).style.setProperty(
      "--small",
      `${ratio ** (-1 / 3)}em`
    );
    (document.body).style.setProperty(
      "--margin-before",
      `${ratio / 2}em`
    );
    (document.body).style.setProperty(
      "--margin-after",
      `${ratio / 4}em`
    );
  };
  // Color
  const implementPaperColor = () => {
    (document.body).style.setProperty(
      "--paper",
      paperColor
    );
    (document.body).style.setProperty(
      "--paper-glass",
      `${paperColor}20`
    );
  }
  const implementTypeColor = () => {
    (document.body).style.setProperty(
      "--type",
      typeColor
    );
    (document.body).style.setProperty(
      "--type-glass",
      `${typeColor}20`
    );
  }
  const implementOffColor = () => {
    (document.body).style.setProperty(
      "--off",
      offColor
    );
    (document.body).style.setProperty(
      "--off-glass",
      `${offColor}20`
    );
  }
  // WIdth
  const implementDocWidth = () => {
    (document.body).style.setProperty(
      "--doc-width",
      `${docWidth}ch`
    );
  };
  */

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

  /*
  useEffect(() => {
    implementFrquency();
    implementRatio();
    implementDocWidth();
    implementPaperColor();
    implementTypeColor();
    implementOffColor();
  }, []);
  */

  const configItems = [];
  Object.keys(theme.config).forEach((item) => {
    configItems.push(ConfigItem(theme.config[item]))
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
