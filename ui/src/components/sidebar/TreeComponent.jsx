import { useEffect, useState } from "react";
import { OpenDocumentEvent } from "../document/types";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";

function TreeComponent({
  data,
  onDelete,
  folder,
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

  const [createChild, setCreateChild] = useState(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const [info, setInfo] = useState(data);

  const [type, setType] = useState("");

  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!data.owner) {
      console.log(
        "getting children: ",
        info.children,
        " => ",
        getChildren(info.children)
      );
      setChildren(getChildren(info.children));
    }
  }, [info.children ? info.children.length : info.id]);

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
    onDelete(info.id, folder);
    /*
    setInfo({ id: null, name: null, children: [] });
    setChildren([]);
    setAppear(false);
    */
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

  function openDocument() {
    console.log("opening doc:", info.id);
    document.dispatchEvent(OpenDocumentEvent(info));
  }

  return (
    <div>
      <div
        className="tree-item"
        onClick={(e) => {
          e.stopPropagation();
          setExpand(!expand);

          if (info.owner) openDocument();
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
        <div className="tree-item">
          <div className="icon"></div>
          {createChild == "folder" ? (
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
          <input
            className="outline-none bg-none min-w-0 outline rounded-1 px-2 py-1 flex-1"
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd(info.id, e.target.value, createChild);
                setCreateChild(null);
                e.stopPropagation();
              } else if (e.key == "Esc") {
                setCreateChild(null);
              }
            }}
          />
        </div>
      )}

      <div className={`${expand ? "block" : " hidden"} pl-3`}>
        {info.children &&
          children.map((child) => (
            <div>
              <TreeComponent
                key={child.id}
                folder={info.id}
                onDelete={onDelete}
                data={child}
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
