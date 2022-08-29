import { useState, useEffect } from "react"
import { EditorView } from "prosemirror-view";
import { ConfigPluginKey } from "../document/plugins/config/plugin";

function ConfigPanel(props: { show: boolean, view: EditorView }) {

  const [config, setConfig] = useState({});

  useEffect(() => {
    console.log(props.view)
    const view = props.view;
    if(view) {
      const configState = ConfigPluginKey.getState(view.state)
      console.log(configState);
      setConfig(configState.config);
    }
  }, [props.show])

  function handleChange(term: string) {
    return (event) => {
      setConfig({ [term]: event.target.value })
      setTerm(term, event.target.value);
    }
  }

  function setTerm(term: string, value: any) {
    const view = props.getView();
    console.log(view);
    view.state.doc.descendants((node, pos, parent, index) => {
      console.log(node);
      if (node.type.name === "header") return true;
      if (node.type.name === "config") return true;
      if (node.type.spec.group === "configterm" && node.type.name == term) {
        const tr = view.state.tr.setNodeMarkup(pos, null, {
          value: value,
        });
        tr.setMeta(ConfigPluginKey, { term: term, value: value });
        view.dispatch(tr);
      }
      return false;
    });
  }

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div>
        <div className="flex gap-3">
          <div>
            <div>Type Scale: </div>
            <div>Size: <input className="min-w-0 flex-1" type="number" value={config.typefrequency} onChange={handleChange("typefrequency")}/></div>
            <div>Ratio: <input className="min-w-0 flex-1" type="number" value={config.typeratio} onChange={handleChange("typeratio")}/></div>
          </div>
          <div>
            <span style={{fontSize: "var(--h1)"}}>H</span><span style={{fontSize: "var(--body)"}}>T</span>
          </div>
        </div>
        <div className="flex gap-3">Full Width</div>
        <div className="flex gap-3">Heading Typeface</div>
        <div className="flex gap-3">Body Typeface</div>
        <div className="flex gap-3">Type Scale</div>
      </div>
    </div>
  );
}

export default ConfigPanel;
