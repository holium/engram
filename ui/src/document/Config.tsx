import React from "react";
import { useEffect, useState } from "react";

import schema from "./build/schema.ts";

function Config(props) {
  const [hidden, toggleHidden] = useState(true);

  const [f, setf] = useState("16");
  const [r, setr] = useState("2");
  const [w, setw] = useState("60");
  const handlef = (event) => {
    setf(event.target.value);
  };
  const handler = (event) => {
    setr(event.target.value);
  };
  const handlew = (event) => {
    setw(event.target.value);
  };
  const implementf = () => {
    (document.querySelector("#document") as any).style.setProperty(
      "--frequency",
      `${f / 16}em`
    );
  };
  const implementr = () => {
    (document.querySelector("#document") as any).style.setProperty(
      "--title",
      `${r ** (4 / 3)}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--h1",
      `${r ** (3 / 3)}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--h2",
      `${r ** (2 / 3)}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--h3",
      `${r ** (1 / 3)}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--small",
      `${r ** (-1 / 3)}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--margin-before",
      `${r / 2}em`
    );
    (document.querySelector("#document") as any).style.setProperty(
      "--margin-after",
      `${r / 4}em`
    );
  };
  const implementw = () => {
    (document.querySelector("#document") as any).style.setProperty(
      "--doc-width",
      `${w}ch`
    );
  };

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

  useEffect(() => {
    implementf();
    implementr();
  }, []);

  return (
    <dl>
      {/* Debugging */}
      {props.dev && (
        <li>
          <dt>devtools</dt>: <br />
          <dd>
            <button onClick={logJSON}>log json</button>
            <button onClick={addDescription}>add description</button>
          </dd>
        </li>
      )}
      <li>
        <dt>&#119891;</dt>:
        <dd>
          <input
            value={f}
            type="number"
            placeholder="frequency"
            onChange={handlef}
            onBlur={implementf}
          />
          <input
            value={f}
            type="range"
            min="6"
            max="32"
            placeholder="frequency"
            onChange={(event) => {
              handlef(event);
              implementf();
            }}
          />
        </dd>
      </li>
      <li>
        <dt>&#000114;</dt>:
        <dd>
          <input
            value={r}
            type="number"
            placeholder="frequency"
            onChange={handler}
            onBlur={implementr}
          />
          <input
            value={r * 100}
            type="range"
            min="100"
            max="500"
            placeholder="frequency"
            onChange={(event) => {
              setr(event.target.value / 100);
              implementr();
            }}
          />
        </dd>
      </li>
      <li>
        <dt>width</dt>:
        <dd>
          <input
            value={w}
            type="number"
            placeholder="frequency"
            onChange={handlew}
            onBlur={implementw}
          />
          <input
            value={w}
            type="range"
            min="20"
            max="120"
            placeholder="frequency"
            onChange={(event) => {
              handlew(event);
              implementw();
            }}
          />
        </dd>
      </li>
      <li>
        <dt>image</dt>:
        <dd>
          <small>
            <input type="file" />
          </small>
        </dd>
      </li>
    </dl>
  );
}

export default Config;
