import { useContext, useState, useEffect } from "react";
import { SlideContext } from "../toolbar/SlideContext";
import {
  listDocuments,
  listFolders,
  getDocumentSettings,
  renameDocument,
  renameFolder,
  createDocument,
  checkUrbitWindow,
  deleteDocument,
  createFolder,
  deleteFolder,
  addToFolder,
  removeFromFolder,
  addRemoteDocument,
} from "../urbit/index";
import * as Y from "yjs";
import { OpenDocumentEvent, pathParser } from "../document/types";
import TreeComponent from "./TreeComponent";
import { UrbitContext } from "../urbit/UrbitProvider";

function Sidebar(props: {
  addDoc: { ship: string; id: string; timestamp: number };
  refresh: number;
}) {
  const [type, setType] = useState("");

  const [ids, setIds] = useState([]);

  const [info, setInfo] = useState([]);

  const urbitStatus = useContext(UrbitContext);
  const [newDoc, setNewDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const { slide, setSlide } = useContext(SlideContext);
  const [createChild, setCreateChild] = useState({});

  useEffect(() => {
    if (props.addDoc == null) return;
    if (
      info
        .map((item) => (item.id.id ? item.id.id : item.id))
        .includes(props.addDoc.id)
    ) {
      document.dispatchEvent(
        OpenDocumentEvent(null, {
          id: props.addDoc.id,
          timestamp: props.addDoc.timestamp,
        })
      );
    } else {
      if (props.addDoc.ship) {
        setNewDoc(true);
        setNewDocName(
          `~${props.addDoc.ship}/${props.addDoc.id}/${props.addDoc.timestamp}`
        );
        setType("remote");
      }
    }
  }, [props.addDoc]);

  useEffect(() => {
    checkUrbitWindow();
    sendData();
    listDocuments()
      .then((docRes) => {
        listFolders()
          .then((folRes) => {
            setInfo([
              ...Object.values(docRes).map((doc) => {
                return {
                  id: doc.id,
                  owner: doc.owner,
                  name: doc.name,
                };
              }),
              ...Object.values(folRes).map((fol) => {
                return {
                  id: fol.meta.id,
                  name: fol.meta.name,
                  children: Object.values(fol.content),
                };
              }),
            ]);
          })
          .catch((err) => {
            console.warn("error listing folders: ", err);
            setInfo([{ id: "null", name: "error getting folders" }]);
          });
      })
      .catch((err) => {
        console.warn("no urbit :(");
        setInfo([
          { owner: "~zod", id: "null", name: "error getting documents" },
        ]);
      });
  }, [props.refresh]);

  useEffect(() => {
    sendData();
  }, [info]);

  const sendData = () => {
    const ids1 = [...info]
      .filter((childData) => childData.children)
      .map((childData) => childData.children);
    const ids2 = ids1.flat();
    const set = new Set(ids2);
    setIds([...Array.from(set)]);
  };

  const getChildren = (identifier) => {
    const content = [...info].filter((child) => {
      return (
        0 <=
        identifier.findIndex((item) => {
          return (
            (item.id ? item.id : item) == (child.id.id ? child.id.id : child.id)
          );
        })
      );
    });
    return content;
  };

  function handleRename(id, newName, isDoc) {
    const toRename = info.findIndex((doc) => {
      return (doc.id.id ? doc.id.id : doc.id) == (id.id ? id.id : id);
    });
    if (id.id) {
      renameDocument(id, newName);
    } else {
      renameFolder(info[toRename], newName);
    }
    info[toRename].name = newName;
  }

  function handleDelete(item, folder) {
    const toDelete = info.findIndex((doc) => {
      return (doc.id.id ? doc.id.id : doc.id) == (item.id ? item.id : item);
    });
    moveToFrom(item, null, folder);
    let children = [];
    if (item.id) {
      deleteDocument(info[toDelete].id);
    } else {
      children = info[toDelete].children;
      deleteFolder(info[toDelete]);
    }
    info.splice(toDelete, 1);
    setInfo([...info]);
    if (typeof item.id == "undefined") {
      children.forEach((child) => {
        handleDelete(child, null);
      });
    }
  }

  async function handleAdd(id, name, type) {
    let res;
    if (type === "folder") {
      res = await createFold(name);
    } else if (type === "file") {
      res = await createDoc(name);
    } else if (type == "remote") {
      res = await addRemoteDoc(name);
    }
    moveToFrom(
      {
        id: res.id,
        name: res.settings ? res.settings.name : res.name,
        owner: res.settings ? res.settings.owner : null,
      },
      id,
      null
    );
  }

  function moveToFrom(id, to, from) {
    // null for root
    let target;
    if (typeof id == "string") target = info.find((tar) => tar.id == id);
    else target = id;
    if (target === undefined) target = info.find((tar) => tar.id.id == id);

    let parent;
    if (typeof from == "string") parent = info.find((tar) => tar.id == from);
    else if (from === "null") parent = null;
    else parent = from;

    if (parent === undefined) {
      parent = null;
    }

    if (parent != null) {
      const removeFrom = info.find((folder) => folder.id == parent.id);
      removeFrom.children.splice(removeFrom.children.indexOf(target.id), 1);
      info.splice(
        info.findIndex((item) => item.id == parent.id),
        1
      );
      removeFromFolder(
        { id: removeFrom.id, name: removeFrom.name },
        { id: target.id, name: target.name },
        target.owner ? true : false
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
        { id: target.id, name: target.name },
        target.owner ? true : false
      );
      info.push(addTo);
    }
    sendData();
  }

  async function createFold(name) {
    checkUrbitWindow();
    let meta;
    if (crypto) {
      meta = await createFolder({
        id: `~${window.ship}-${crypto.randomUUID()}`,
        name: name,
      });
    } else {
      meta = await createFolder({
        id: `~${window.ship}-${name.replaceAll(" ", "-")}-${Date.now()}`,
        name: name,
      });
    }
    info.push({ ...meta, children: [] });
    setInfo([...info]);
    closeCreateDoc();
    return meta;
  }

  async function createDoc(name) {
    checkUrbitWindow();

    const doc = new Y.Doc();
    doc.clientID = window.ship; // the ship
    doc.gc = false;
    const type = doc.getXmlFragment("prosemirror");
    const version = Y.encodeStateVector(doc);
    const encoding = Y.encodeStateAsUpdate(doc);

    const { id, settings } = await createDocument(name, {
      version: Array.from(version),
      content: JSON.stringify(Array.from(encoding)),
    });
    info.push({ id: id, name: settings.name, owner: (window as any).ship });
    setInfo([...info]);
    closeCreateDoc();
    return { id, settings };
  }

  function addRemoteDoc(link): Promise {
    checkUrbitWindow();
    return new Promise((resolve, reject) => {
      addRemoteDocument(link).then((meta) => {
        setTimeout(() => {
          pingRemoteDoc(meta).then((res) => {
            info.push(res);
            setInfo([...info]);
            closeCreateDoc();
            return meta;
          });
        }, 12000);
      });
    });
  }

  function pingRemoteDoc(meta): Promise {
    return new Promise((resolve, reject) => {
      try {
        console.warn("pinging...");
        getDocumentSettings(meta).then((settings) => {
          resolve({
            id: meta,
            name: settings.name,
            owner: "~" + settings.owner,
          });
        });
      } catch (err) {
        setTimeout(() => {
          pingRemoteDoc(meta).then((res) => {
            resolve(res);
          });
        }, 1000);
      }
    });
  }

  function closeCreateDoc() {
    setNewDoc(false);
    setNewDocName("");
    setType("");
  }

  return (
    <div id="sidebar" className={slide ? "hide-sidebar" : ""}>
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
      <div
        className=" flex-grow"
        dropzone
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.stopPropagation();
          event.preventDefault();
          moveToFrom(
            event.dataTransfer.getData("id"),
            null,
            event.dataTransfer.getData("parent")
          );
        }}
      >
        <div className="flex flex-col overflow-y-auto overflow-x-hidden">
          <div className="mt-3 tree-item">
            <div
              className="flex-grow py-1"
              style={{
                opacity: ".5",
                fontVariant: "all-small-caps",
                fontSize: "18px",
                letterSpacing: "1px",
                fontWeight: 500,
              }}
            >
              workspace
            </div>
            {
              //Add Remote Document
            }
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="var(--type-color)"
              className="icon clickable tree-item-hidden"
              onClick={() => {
                setNewDoc(true);
                setType("remote");
              }}
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 1 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 1 0 12 17.657l1.414-1.414 1.414 1.414zm0-9.9l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" />
            </svg>
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
                className="outline-none bg-none flex-grow outline rounded-1 px-2 py-1 realm-cursor-text-cursor"
                style={{
                  outlineColor: "var(--type-color)",
                  outlineWidth: "1px",
                  outlineOffset: "0",
                  minWidth: "0",
                }}
                placeholder={
                  type == "remote"
                    ? "~zod/..."
                    : type == "folder"
                    ? "Folder-Path"
                    : "Document Name"
                }
                value={newDocName}
                onChange={(event) => {
                  setNewDocName(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    if (type === "file") {
                      createDoc(newDocName);
                      setNewDocName("");
                    } else if (type === "folder") {
                      createFold(newDocName);
                      setNewDocName("");
                    } else if (type === "remote") {
                      addRemoteDoc(newDocName);
                      setNewDocName("");
                    }
                    closeCreateDoc();
                  }
                  if (event.key == "Escape") closeCreateDoc();
                }}
              />
            </div>
          )}

          {info
            .filter((child) => {
              return (
                0 >
                ids.findIndex((item) => {
                  return (
                    (item.id ? item.id : item) ==
                    (child.id.id ? child.id.id : child.id)
                  );
                })
              );
            })
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

            .map((childData, index, arr) => {
              return (
                <div>
                  <TreeComponent
                    key={childData.owner ? childData.id.id : childData.id}
                    data={childData}
                    folder={null}
                    addType={type}
                    onDelete={handleDelete}
                    getChildren={getChildren}
                    handleAdd={handleAdd}
                    createChild={createChild}
                    handleRename={handleRename}
                    moveToFrom={moveToFrom}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="pb-3"></div>
    </div>
  );
}

export default Sidebar;
