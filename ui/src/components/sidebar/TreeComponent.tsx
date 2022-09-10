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
  moveToFrom,
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

  const [children, setChildren] = useState([]);

  useEffect(() => {
    if (!data.owner) {
      setChildren(getChildren(info.children));
    }
  }, [info.children ? info.children.length : info.id]);

  const toggleAdd = (name, type) => {
    handleAdd(info.id, name, type);
    setChildren(getChildren(info.children));
    setExpand(true);
  };

  function hideMenu(event) {
    event.stopPropagation();
    setAppear(false);
  }

  const handleDelete = () => {
    onDelete(info.id, folder, false);
  };

  function ToggleFolderMenu(event) {
    event.stopPropagation();
    setAppear(!appear);
  }

  function renameFolder(event) {
    event.stopPropagation();
    setrenameState(false);
  }

  function openDocument() {
    document.dispatchEvent(OpenDocumentEvent(info.id));
  }

  return (
    <div
      draggable="true"
      dropzone
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("id", info.id);
        e.dataTransfer.setData("parent", folder);
      }}
      onDragOver={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
      onDrop={
        !info.children
          ? (e) => {
              /* */
            }
          : (event) => {
              event.stopPropagation();
              event.preventDefault();
              if (event.dataTransfer.getData("id") != info.id) {
                moveToFrom(
                  event.dataTransfer.getData("id"),
                  info.id,
                  event.dataTransfer.getData("parent")
                );
              }
            }
      }
    >
      <div
        className="tree-item"
        onClick={(e) => {
          e.stopPropagation();
          setExpand(!expand);

          if (info.owner) openDocument();
        }}
      >
        {info.owner ? (
          info.owner == window.ship ? (
            // a dot if this ship is the origin
            <svg
              viewBox="0 0 25 25"
              fill="var(--type-color)"
              style={{ opacity: ".8" }}
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.3036 12.6518C17.3036 15.2219 15.2219 17.3036 12.6518 17.3036C10.0817 17.3036 8 15.2219 8 12.6518C8 10.0817 10.0817 8 12.6518 8C15.2219 8 17.3036 10.0817 17.3036 12.6518Z" />
            </svg>
          ) : (
            // a tilde if the origin is remote
            <svg
              viewBox="0 0 25 25"
              fill="var(--type-color)"
              className="icon"
              style={{ opacity: ".8" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.90419 10.8605C8.32859 10.8605 7.86054 11.3286 7.86054 11.9042V14.5816C7.86054 15.0962 7.44483 15.5119 6.93027 15.5119C6.41572 15.5119 6 15.0962 6 14.5816V11.9042C6 10.2995 7.29947 9 8.90419 9C9.67457 9 10.413 9.30525 10.9566 9.85178L15.3812 14.2764C15.576 14.4712 15.8434 14.5816 16.1196 14.5816C16.6952 14.5816 17.1633 14.1136 17.1633 13.538V10.8605C17.1633 10.346 17.579 9.93027 18.0935 9.93027C18.6081 9.93027 19.0238 10.346 19.0238 10.8605V13.538C19.0238 15.1427 17.7243 16.4422 16.1196 16.4422C15.3492 16.4422 14.6108 16.1369 14.0672 15.5904L9.6426 11.1658C9.44782 10.971 9.18037 10.8605 8.90419 10.8605Z" />
            </svg>
          )
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
              handleRename(
                info.id,
                e.target.value,
                typeof info.owner != "undefined"
              );
              setrenameState(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename(
                  info.id,
                  e.target.value,
                  typeof info.owner != "undefined"
                );
                setrenameState(false);
              } else if (e.key == "Escape") {
                setrenameState(false);
                setNewName("");
              }
            }}
          />
        ) : (
          <div className="py-1 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap cursor-pointer hover:underline">
            {info.name}
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
        <menu>
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
                canRename={info.owner == (window as any).ship}
                renameFile={setrenameState}
                onDelete={handleDelete}
                position={pos}
                id={info.id}
                owner={info.owner}
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
                setNewDoc("");
                e.stopPropagation();
              } else if (e.key == "Esc") {
                setCreateChild(null);
                setNewDoc("");
              }
            }}
          />
        </div>
      )}

      <div className={`${expand ? "block" : " hidden"} pl-3`}>
        {info.children &&
          children
            .sort((a, b) => {
              if ((a.owner && b.owner) || (!a.owner && !b.owner)) {
                if (a.name > b.name) {
                  return 1;
                } else if (a.name < b.name) {
                  return -1;
                } else {
                  return 0;
                }
              } else if (a.owner) {
                return 1;
              } else {
                return -1;
              }
            })
            .map((child) => (
              <div>
                <TreeComponent
                  key={child.owner ? child.id.id : child.id}
                  folder={info.id}
                  onDelete={onDelete}
                  data={child}
                  getChildren={getChildren}
                  handleAdd={handleAdd}
                  handleRename={handleRename}
                  moveToFrom={moveToFrom}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default TreeComponent;
