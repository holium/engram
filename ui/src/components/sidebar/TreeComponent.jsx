import { useEffect, useState } from "react";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";

function TreeComponent({
  data,
  onDelete,
  getChildren,
  handleAdd,
  handleRename,
}) {
  const [expand, setExpand] = useState(false);

  const [appear, setAppear] = useState(false);

  const [renameState, setrenameState] = useState(false);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    setNewName(info.name);
  }, [renameState]);

  const [newDoc, setNewDoc] = useState("untitled");

  const [createChild, setCreateChild] = useState(false);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const [info, setInfo] = useState(data);

  const [type, setType] = useState("");

  const [info, setInfo] = useState(data);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!data.owner) {
      setChildren(getChildren(info.children));
    }
  }, [createChild]);

  const toggleAdd = (name, type) => {
    handleAdd(info.name, name, type);
    setChildren(getChildren(info.children));
    setExpand(true);
  };

  function hideMenu(event) {
    event.stopPropagation();
    setAppear(false);
  }

  const handleDelete = () => {
    onDelete(info.name);
    setInfo({ id: null, name: null, children: [] });
    setChildren([]);
    setAppear(false);
  };

  function ToggleFolderMenu(event) {
    event.stopPropagation();
    setAppear(!appear);
  }

  function renameFolder(event) {
    event.stopPropagation();
    setrenameState(false);
    console.log("rename");
    //middleware
  }

  return (
    <div>
      <div
        className="tree-item"
        onClick={(e) => {
          setExpand(!expand);
          e.stopPropagation();
        }}
      >
        {info.owner ? (
          <div className="icon"></div>
        ) : !expand ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon clickable"
            style={info.children.length > 0 ? {} : { opacity: ".6" }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon clickable"
            style={info.children.length > 0 ? {} : { opacity: ".6" }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
          </svg>
        )}

        {info.id === null ? (
          ""
        ) : info.children ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M4 5v14h16V7h-8.414l-2-2H4zm8.414 0H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M9 2.003V2h10.998C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6-5.997zM5.83 8H9V4.83L5.83 8zM11 4v5a1 1 0 0 1-1 1H5v10h14V4h-8z" />
          </svg>
        )}

        {renameState ? (
          <input
            className="outline-none bg-none min-w-0 outline rounded-1 px-2 py-1 flex-1"
            style={{
              outlineColor: "var(--type-color)",
              outlineWidth: "1px",
              outlineOffset: "0",
              minWidth: "0",
            }}
            value={newName}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            autoFocus
            onBlur={(e) => {
              handleRename(info.id, e.target.value);
              setrenameState(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename(info.id, e.target.value);
                setrenameState(false);
                e.stopPropagation();
              } else if (e.key == "Esc") {
                setrenameState(false);
              }
            }}
          />
        ) : (
          <div className="py-1 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {" "}
            {info.name}{" "}
          </div>
        )}
        {!renameState && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon clickable tree-item-hidden"
            onClick={(e) => {
              ToggleFolderMenu(e);
              setPos({ top: e.clientY, left: e.clientX });
            }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M4.5 10.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S6 12.825 6 12s-.675-1.5-1.5-1.5zm15 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S21 12.825 21 12s-.675-1.5-1.5-1.5zm-7.5 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z" />
          </svg>
        )}
        <menu onMouseLeave={hideMenu}>
          {appear &&
            (info.children ? (
              <FolderMenu
                ToggleFolderMenu={ToggleFolderMenu}
                renameFolder={setrenameState}
                onDelete={handleDelete}
                name={info.name}
                handleAdd={toggleAdd}
                position={pos}
                setCreateChild={setCreateChild}
              />
            ) : (
              <FileMenu
                ToggleFolderMenu={ToggleFolderMenu}
                renameFolder={setrenameState}
                onDelete={handleDelete}
                position={pos}
              />
            ))}
        </menu>
      </div>

      {createChild && (
        <div className="flex px-4 py-1 gap-3">
          <input
            className="outline-none bg-none flex-grow outline rounded-1 px-2 py-1"
            style={{
              outlineColor: "var(--type-color)",
              outlineWidth: "1px",
              outlineOffset: "0",
              minWidth: "0",
            }}
            value={newDoc}
            onChange={(event) => {
              setNewDoc(event.target.value);
            }}
          />
          <i
            onClick={(e) => (
              e.stopPropagation(),
              handleAdd(info.id, newDoc, "folder"),
              setCreateChild(false)
            )}
            className="ri-checkbox-line icon clickable"
          />
          <i
            onClick={(e) => (e.stopPropagation(), setCreateChild(false))}
            className=" ri-close-line icon clickable"
          />
        </div>
      )}

      <div className={`${expand ? "block" : " hidden"} pl-3`}>
        {info.children &&
          children.map((childData) => (
            <div>
              <TreeComponent
                key={childData.id}
                onDelete={onDelete}
                data={childData}
                getChildren={getChildren}
                handleAdd={handleAdd}
                handleRename={handleRename}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default TreeComponent;
