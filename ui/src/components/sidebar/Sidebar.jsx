import { useContext, useState, useEffect } from "react";
import { SlideContext } from "../toolbar/SlideContext";
import {
  listDocuments,
  createDocument,
  checkUrbitWindow,
  deleteDocument,
  createFolder,
  deleteFolder,
  addToFolder,
  removeFromFolder
} from "../urbit/index";
import { OpenDocumentEvent } from "../document/types";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Y from "yjs";
import FileTree from "./FileTree";
import TreeComponent from "./TreeComponent";
import FolderMenu from "./FolderMenu";

import { UrbitContext } from "../urbit/UrbitProvider";
import RootMenu from "./RootMenu";

function Sidebar() {

  const [type, setType] = useState("");

  const [info, setInfo] = useState({
    children: [],
  })

  const [pos, setPos] = useState({top: 0,
  left: 0
  });
  const [appear, setAppear] = useState(false);
  const urbitStatus = useContext(UrbitContext);
  const [list, setList] = useState([]);
  const [newDoc, setNewDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");


  useEffect(() => {
    console.log(info.children)
    checkUrbitWindow();
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
        setList([{ owner: "~zod", id: "123", name: "doc" }]);
      });
  }, []);



  function handleDelete(prop){
    console.log(info)
    const children = info.children.filter(child => child.name !== prop);
    setInfo(previousInputs=>({...previousInputs, children: children}))
  
    /*
    delete middleware for deleteFolder or deleteDocument
    */
  }
  
  function create(e){
    e.stopPropagation()
    if(type==="file") {
      createDoc();
  
    } else if(type ==="folder"){
      createFold();
    }
    closeCreateDoc()
  }

  function openDocument(doc: any) {
    console.log("opening doc:", doc);
    document.dispatchEvent(OpenDocumentEvent(doc));
  }


  function createFold() {
    console.log("create folder");
    checkUrbitWindow();
    const meta: FolderMeta = {
      owner: `~${window.ship}`,
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(" ", "-"),
      children: [],
      isFolder: "folder"
    };

    createFolder(meta).then((res) => {
      console.log("create folder result", res);
    });
    setInfo(previousInputs=>({children: [meta, ...previousInputs.children]}))
    closeCreateDoc();
  }

  function createDoc() {
    console.log("create doc");
    checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: `~${window.ship}`,
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(" ", "-"),
      children: null,
      isFolder: "file"
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
    //setList([meta, ...list]);
    setInfo(previousInputs=>({children: [meta, ...previousInputs.children]}))
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

  
  return (
    <div className="flex flex-col" style={{ width: "18vw", minWidth: "280px" }}>
      <div className="px-4 py-3 flex items-center">
        <div className="azimuth">~{urbitStatus.ship}</div>
        <div className="flex-grow"> </div>
        <i className="ri-checkbox-blank-circle-fill icon"
          style={
            urbitStatus.connection < 2
              ? { color: "var(--status-success-color)" }
              : { color: "var(--status-failure-color)" }
          }
        />
      </div>
      <div className="flex flex-col overflow-auto">
        <div className="mt-4 tree-item">
          <div className="font-bold flex-grow py-1">Your Ship</div>
          <menu onMouseLeave = {()=>(setAppear(false))}>
          <i className="ri-add-box-line icon clickable tree-item-hidden"
            onClick={(e) => {setAppear(true); setPos({top: e.clientY, left: e.clientX})}}
          />
          {appear && <RootMenu position = {pos} setAppear = {setAppear} setDoc = {setNewDoc} setType = {setType}/>}
          </menu>
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
                if (event.key == "Enter") create(event);
                if (event.key == "Esc") closeCreateDoc();
              }}
            />
            <i
              onClick={(event)=>{create(event)}}
              className="ri-checkbox-line icon clickable"
            />
            <i
              onClick={closeCreateDoc}
              className=" ri-close-line icon clickable"
            />
          </div>
        )}
        {list.map((doc, i) => {
          return (
            <div
              className="tree-item clickable"
              onClick={() => {
                openDocument(doc);
              }}
            >
              <div className="py-1 flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
                {doc.name}
              </div>
              <FontAwesomeIcon
                onClick={(event) => {
                  event.stopPropagation();
                  deleteDoc(doc, i);
                }}
                icon={regular("trash-alt")}
                className="icon clickable tree-item-hidden"
              />
            </div>
          );
        })
        }
          {info.children.map((childData) => (
                            <div
                            className=" pl-3"
                            onClick={() => { if(childData.isFolder === "file") {
                              openDocument(childData);}
                            }}
                          >
                <TreeComponent key = {Math.random()} data = {childData} onDelete = {handleDelete}/>
                </div>
            ))}
      </div>
    </div>
  );
  

}

export default Sidebar;
