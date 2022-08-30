import { useContext, useState, useEffect } from "react";
import { SlideContext } from "../toolbar/SlideContext";
import {
  listDocuments,
  listFolders,
  createDocument,
  checkUrbitWindow,
  deleteDocument,
  createFolder,
  deleteFolder,
  addToFolder,
  removeFromFolder,
} from "../urbit/index";
import { OpenDocumentEvent } from "../document/types";
import * as Y from "yjs";
import FileTree from "./FileTree";
import TreeComponent from "./TreeComponent";
import FolderMenu from "./FolderMenu";

import { UrbitContext } from "../urbit/UrbitProvider";
import RootMenu from "./RootMenu";

function Sidebar() {
  const [type, setType] = useState("");

  const [ids, setIds] = useState([]);

  const [info, setInfo] = useState([]);

  const [appear, setAppear] = useState(false);
  const urbitStatus = useContext(UrbitContext);
  const [list, setList] = useState([]);
  const [newDoc, setNewDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [slide, setSlide] = useState(false);
  const [createChild, setCreateChild] = useState({});

  useEffect(() => {
    console.log(info);
    checkUrbitWindow();
    sendData();
    listDocuments()
      .then((res) => {
        console.log("list documents result: ", res);
        setList(
          Object.keys(res).map((key) => {
            return {
              id: key,
              owner: "~" + res[key].owner,
              name: res[key].name,
            };
          })
        );
      })
      .catch((err) => {
        console.log("no urbit :(");
        setList([
          { owner: "~zod", id: "null", name: "error getting documents" },
        ]);
      });
    listFolders()
      .then((res) => {
        console.log("list folders result: ", res);

        setInfo(
          Object.keys(res).map((index) => {
            console.log(Object.keys(res[index].content));
            return {
              id: res[index].meta.id,
              name: res[index].meta.name,
              children: Object.keys(res[index].content),
            };
          })
        );
      })
      .catch((err) => {
        console.warn("error listing folders: ", err);
        setList([{ id: "null", name: "error getting folders" }]);
      });
  }, []);

  const sendData = () => {
    const ids1 = info.map((childData) => childData.children);
    const ids2 = ids1.flat();
    const set = new Set(ids2);
    setIds(Array.from(set));
  };

  const getChildren = (identifier) => {
    const content = info
      .filter((child) => identifier.includes(child.name))
      .map((childData) => childData);
    console.log("Log in getChildren:");
    console.log(content);
    return content;
  };

  const handleRename = (id, newName) => {
    info.find((child) => {
      if (child.id === id) {
        child.name = newName;
      }
    });
    console.log(info);
  };

  function handleDelete(prop) {
    const child = info.filter((child) => child.id === prop);
    const children = info.filter(
      (element) =>
        element.id !== prop && !child[0].children.includes(element.id)
    );
    children.map((element) => {
      if (element.children.includes(prop)) {
        element.children.splice(element.children.indexOf(prop), 1);
      }
    });
    console.log(children);
    setInfo(children);

    sendData();

    /*
    delete middleware for deleteFolder or deleteDocument
    */
  }

  function handleAdd(id, name, type) {
    const children = info;
    const new_id = crypto.randomUUID();
    if (type === "folder") {
      children.push({ id: new_id, name: name, children: [] });
    } else {
      children.push({ id: new_id, name: name, owner: `~${window.ship}` });
    }
    children.map((child) => {
      if (child.id === id) {
        child.children.push(new_id);
      }
    });
    setInfo(children);
    console.log(children);
    sendData();
  }

  function openDocument(doc: any) {
    console.log("opening doc:", doc);
    document.dispatchEvent(OpenDocumentEvent(doc));
  }

  function createFold() {
    console.log("create folder");
    checkUrbitWindow();
    const meta: FolderMeta = {
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(" ", "-"),
    };

    createFolder(meta).then((res) => {
      console.log("create folder result", res);
    });
    setInfo([...info, meta]);
    closeCreateDoc();
  }

  function createDoc() {
    console.log("create doc");
    checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: `~${window.ship}`,
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(" ", "-"),
    };

    const doc = new Y.Doc();
    doc.clientID = window.ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const version = Y.encodeStateVector(doc);
    const encoding = Y.encodeStateAsUpdateV2(doc);

    createDocument(meta, {
      version: Array.from(version),
      content: Array.from(encoding),
    }).then((res) => {
      console.log("create document result", res);
    });
    setInfo([...info, meta]);
    closeCreateDoc();
  }
  function closeCreateDoc() {
    setNewDoc(false);
    setNewDocName("");
    setType("");
  }

  function deleteDoc(doc) {
    console.log("deleting document:", doc);
    deleteDocument(doc).then((res) => {
      console.log("delete document result:", res);
    });
  }

  function deleteFold(folder) {
    console.log("deleting folder: ", folder);
    deleteFolder(folder);
    listFolders().then((res) => {
      console.log(res);
    });
  }

  return (
    <div
      id="sidebar"
      style={{
        display: slide ? "none" : "flex",
      }}
    >
      <div className="px-4 py-3 flex items-center">
        <div className="azimuth">~{urbitStatus.ship}</div>
        <div className="flex-grow"> </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="icon"
          fill={
            urbitStatus.connection < 2
              ? "var(--status-success-color)"
              : "var(--status-failure-color)"
          }
        >
          <ellipse cx="12" cy="12" rx="10" ry="10" />
        </svg>
      </div>
      <div className="flex flex-col overflow-auto">
        <div className="mt-4 tree-item">
          <div className="font-bold flex-grow py-1">Your Ship</div>
          {/* Add Document */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon clickable tree-item-hidden"
            onClick={() => {
              setNewDoc(true);
              setType("file");
            }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zM11 11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
          </svg>
          {/* Add Folder */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--type-color)"
            className="icon clickable tree-item-hidden"
            onClick={() => {
              setNewDoc(true);
              setType("folder");
            }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM4 5v14h16V7h-8.414l-2-2H4zm7 7V9h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
          </svg>
        </div>
        {newDoc && (
          <div className="flex px-4 py-1 gap-3">
            <input
              className="outline-none bg-none flex-grow outline rounded-1 px-2 py-1"
              style={{
                outlineColor: "var(--type-color)",
                outlineWidth: "1px",
                outlineOffset: "0",
                minWidth: "0",
              }}
              value={newDocName}
              onChange={(event) => {
                setNewDocName(event.target.value);
              }}
              onKeyPress={(event) => {
                console.log(event);
                if (event.key == "Enter") {
                  if (type === "file") {
                    createDoc();
                  } else if (type === "folder") {
                    createFold();
                  }
                  closeCreateDoc();
                }
                if (event.key == "Esc") closeCreateDoc();
              }}
            />
            {/*<i
              onClick={(event) => {
                create(event);
              }}
              className="ri-checkbox-line icon clickable"
            />
            <i
              onClick={closeCreateDoc}
              className=" ri-close-line icon clickable"
            />*/}
          </div>
        )}

        {info
          .filter((child) => !ids.includes(child.name))
          .map((childData, index) => (
            <div
              onClick={() => {
                if (childData.child) {
                  openDocument(childData);
                }
              }}
            >
              <TreeComponent
                key={childData.id}
                data={childData}
                onDelete={handleDelete}
                getChildren={getChildren}
                handleAdd={handleAdd}
                createChild={createChild}
                handleRename={handleRename}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
