import { useState } from "react";
import { light } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function TreeComponent({ data }) {
  const [expand, setExpand] = useState(false);

  return (
    <div>
      <div className="flex" onClick={() => setExpand(!expand)}>
        <div className="pr-2">
          {data.isFolder ? (
            <FontAwesomeIcon icon={light("folder")} />
          ) : (
            <FontAwesomeIcon icon={light("file")} />
          )}
        </div>
        {data.label}
      </div>

      <div className={`${expand ? "block" : " hidden"} pl-3`}>
        {data.children.map((childData) => (
          <TreeComponent data={childData} />
        ))}
      </div>
    </div>
  );
}

export default TreeComponent;
