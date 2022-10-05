import { useState, useEffect } from "react";
import { EditorView } from "prosemirror-view";
import { ConfigPluginKey } from "../document/prosemirror/config/plugin";

function ConfigPanel(props: { show: boolean; view: EditorView }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    loadConfig();
  }, [props.show, props.view]);

  function loadConfig() {
    if (props.view) {
      const configState = ConfigPluginKey.getState(props.view.state);
      if (typeof configState == "undefined") {
        setTimeout(() => {
          loadConfig();
        }, 500);
      } else {
        const res = {};
        Object.keys(configState.config).forEach((term: string) => {
          res[term] = configState.config[term].value;
        });
        setConfig(res);
      }
    }
  }

  function handleChange(term: string) {
    return (event) => {
      setConfig({ ...config, [term]: event.target.value });
      setTerm(term, event.target.value);
    };
  }

  function setTerm(term: string, value: any) {
    props.view.state.doc.descendants((node, pos, parent, index) => {
      if (node.type.name === "header") return true;
      if (node.type.name === "config") return true;
      if (node.type.spec.group === "configterm" && node.type.name == term) {
        const tr = props.view.state.tr.setNodeMarkup(pos, null, {
          value: value,
        });
        tr.setMeta(ConfigPluginKey, { term: term, value: value });
        props.view.dispatch(tr);
      }
      return false;
    });
  }

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div>
        <div className="flex gap-3 relative">
          <div className="flex-1" style={{ width: "64%" }}>
            <div className="flex gap-3 py-1">
              <div className="py-1 px-2 flex-1 flex">
                <div className="flex-grow">Width:</div> {config.documentwidth}
              </div>
              <input
                className="min-w-0 flex-1 text-right py-1 px-2 outline-none"
                min="40"
                max="120"
                type="range"
                value={config.documentwidth}
                onChange={handleChange("documentwidth")}
              />
            </div>
            <div className="flex gap-3 py-1">
              <div className="py-1 px-2 flex-1 flex">
                <div className="flex-grow">Font Size:</div>
                {config.typefrequency}
              </div>
              <input
                className="min-w-0 flex-1 text-right py-1 px-2 outline-none"
                min="8"
                max="48"
                type="range"
                value={config.typefrequency}
                onChange={handleChange("typefrequency")}
              />
            </div>
            <div className="flex gap-3 py-1">
              <div className="py-1 px-2 flex-1 flex">
                <div className="flex-grow">Scale Ratio:</div>{" "}
                {Math.floor(config.typeratio)}
              </div>
              <input
                className="min-w-0 flex-1 text-right px-2 py-1 outline-none"
                min="100"
                max="400"
                type="range"
                value={config.typeratio * 100}
                onChange={(event) => {
                  handleChange("typeratio")({
                    target: { value: event.target.value / 100 },
                  });
                }}
              />
            </div>
            <div className="flex gap-3 py-1">
              <div className="flex-1 py-1 px-2">Headings: </div>
              <select
                className="min-w-0 flex-1 text-right px-2 py-1 outline-none bg-none"
                value={config.headingtypeface}
                onChange={handleChange("headingtypeface")}
              >
                <option className="text-right" value="sans">
                  Sans Serif
                </option>
                <option className="text-right" value="serif">
                  Serif
                </option>
                <option className="text-right" value="mono">
                  Monospace
                </option>
              </select>
            </div>
            <div className="flex gap-3 py-1">
              <div className="flex-1 py-1 px-2">Body: </div>
              <select
                className="min-w-0 flex-1 text-right px-2 py-1 outline-none bg-none"
                value={config.bodytypeface}
                onChange={handleChange("bodytypeface")}
              >
                <option className="text-right" value="sans">
                  Sans Serif
                </option>
                <option className="text-right" value="serif">
                  Serif
                </option>
                <option className="text-right" value="mono">
                  Monospace
                </option>
              </select>
            </div>
          </div>
          <div
            className="flex items-center justify-center p-4"
            style={{ width: "32%" }}
          >
            <div>
              <span
                style={{
                  fontSize: "var(--h1)",
                  fontFamily: "var(--heading-font-family)",
                  lineHeight: "var(--leading-heading)",
                }}
              >
                H
              </span>
              <span
                style={{
                  fontSize: "var(--body)",
                  fontFamily: "var(--body-font-family)",
                  lineHeight: "var(--body-heading)",
                }}
              >
                T
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;
