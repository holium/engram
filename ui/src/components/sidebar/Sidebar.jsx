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
    checkUrbitWindow();
    sendData();
    listDocuments()
      .then((docRes) => {
        console.log("list documents result: ", docRes);
        listFolders()
          .then((folRes) => {
            console.log("list folders result: ", folRes);

            setInfo([
              ...Object.keys(docRes).map((index) => {
                return {
                  id: index,
                  owner: "~" + docRes[index].owner,
                  name: docRes[index].name,
                };
              }),
              ...Object.values(folRes).map((fol) => {
                return {
                  id: fol.meta.id,
                  name: fol.meta.name,
                  children: Object.values(fol.content).map((item) => item.id),
                };
              }),
            ]);
          })
          .catch((err) => {
            console.warn("error listing folders: ", err);
            setList([{ id: "null", name: "error getting folders" }]);
          });
      })
      .catch((err) => {
        console.log("no urbit :(");
        setList([
          { owner: "~zod", id: "null", name: "error getting documents" },
        ]);
      });
  }, []);

  useEffect(() => {
    sendData();
  }, [info]);

  const sendData = () => {
    const ids1 = info
      .filter((childData) => childData.children)
      .map((childData) => childData.children);
    const ids2 = ids1.flat();
    const set = new Set(ids2);
    setIds([...Array.from(set)]);
  };

  const getChildren = (identifier) => {
    console.log("getting children: ", identifier, " from ", info);
    const content = info.filter((child) => identifier.includes(child.id));
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

  function handleDelete(item, folder) {
    const toDelete = info.findIndex((doc) => doc.id == item);
    console.log("deleting: ", info[toDelete]);
    moveToFrom(item, null, folder);
    if (info[toDelete].owner) {
      deleteDocument(info[toDelete]);
    } else {
      deleteFolder(info[toDelete]);

      const newInfo = info;
      newInfo.splice(toDelete, 1);
      setInfo([...newInfo]);
      sendData();
    }
  }

  function handleAdd(id, name, type) {
    console.log("adding: ", name);
    let res;
    if (type === "folder") {
      res = createFold(name);
    } else {
      res = createDoc(name);
    }
    moveToFrom(res, id, null);

    sendData();
  }

  function moveToFrom(id, to, from) {
    // null for root
    let target;
    if (typeof target == "string") target = info.find((tar) => tar.id == id);
    else target = id;
    if (from != null) {
      const removeFrom = info.find((folder) => folder.id == from);
      removeFrom.children.splice(removeFrom.children.indexOf(target.id), 1);
      info.splice(
        info.findIndex((item) => item.id == from),
        1
      );
      removeFromFolder(
        { id: removeFrom.id, name: removeFrom.name },
        {
          id: target.id,
          name: target.name,
          ...(target.owner ? { owner: target.owner } : {}),
        }
      );
      info.push(removeFrom);
    }
    if (to != null) {
      const addTo = info.find((folder) => folder.id == to);
      addTo.children.push(target.id);
      info.splice(
        info.findIndex((item) => item.id == to),
        1
      );
      addToFolder(
        { id: addTo.id, name: addTo.name },
        {
          id: target.id,
          name: target.name,
          ...(target.owner ? { owner: target.owner } : {}),
        }
      );
      info.push(addTo);
    }
  }

  function createFold(name) {
    console.log("create folder");
    checkUrbitWindow();

    const meta = createFolder({
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: name,
    }).then((res) => {
      console.log("create folder result", res);
    });
    setInfo([...info, { ...meta, children: [] }]);
    closeCreateDoc();
    return meta;
  }

  async function createDoc(name) {
    console.log("create doc");
    checkUrbitWindow();

    const doc = new Y.Doc();
    doc.clientID = window.ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const version = Y.encodeStateVector(doc);
    const encoding = Y.encodeStateAsUpdateV2(doc);

    const meta = await createDocument(
      {
        owner: `~${window.ship}`,
        id: `~${window.ship}-${crypto.randomUUID()}`,
        name: name,
      },
      {
        version: Array.from(version),
        content: Array.from(encoding),
      }
    );
    console.log("create document result", meta);
    setInfo([...info, meta]);
    closeCreateDoc();
    return meta;
  }

  function closeCreateDoc() {
    setNewDoc(false);
    setNewDocName("");
    setType("");
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
          {
            //Add Document
          }
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
          {
            // Add Folder
          }
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
                    createDoc(newDocName);
                    setNewDocName("");
                  } else if (type === "folder") {
                    createFold(newDocName);
                    setNewDocName("");
                  }
                  closeCreateDoc();
                }
                if (event.key == "Esc") closeCreateDoc();
              }}
            />
          </div>
        )}

        {info
          .filter((child) => !ids.includes(child.id))
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
          .map((childData, index) => (
            <div>
              <TreeComponent
                key={childData.id}
                data={childData}
                folder={null}
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
