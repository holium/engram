import { EditorView } from "prosemirror-view";
import { ConfigPluginKey } from "../document/plugins/config/plugin";

function ConfigPanel(props: { show: boolean, getView: () => EditorView }) {
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
            <div>Size: </div>
            <div>Ratio: </div>
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
