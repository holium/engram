import { useState } from "react";
function Debuger() {
  const [app, setApp] = useState("engram");
  const [path, setPath] = useState("");
  const [result, setResult] = useState(null);

  function scry() {
    (window as any).urbit.scry({ app: app, path: path }).then((result) => {
      setResult(result);
      console.log(result);
    });
  }

  return (
    <div className="px-4 py-3">
      <div className="flex gap-3">
        <div className="strong">app: </div>
        <input value={app} onChange={(event) => setApp(event.target.value)} />
      </div>
      <div className="flex gap-3">
        <div className="strong">path: </div>
        <input value={path} onChange={(event) => setPath(event.target.value)} />
      </div>
      <div>{result}</div>
    </div>
  );
}

export default Debuger;
