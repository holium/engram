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

  const [ids, setIds] = useState([])

  const [info, setInfo] = useState([])

  const [pos, setPos] = useState({top: 0,
  left: 0
  });
  
  const [appear, setAppear] = useState(false);
  const urbitStatus = useContext(UrbitContext);
  const [list, setList] = useState([]);
  const [newDoc, setNewDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [slide, setSlide] = useState(false)
  const [createChild, setCreateChild] = useState({});

  useEffect(() => {
    checkUrbitWindow();
    sendData()
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
        setInfo([{ owner: "~zod", id: "123", name: "doc" }]);
      });
    listFolders()
      .then((res) => {
        console.log("list folders result: ", res);
      })
      .catch((err) => {
        console.warn("error listing folders: ", err);
      });
  }, []);


  const sendData  = () => {
    console.log("converting ids...")
    const ids1 = info.map(childData => childData.children)
    const ids2 = ids1.flat()
    const set = new Set(ids2)
    setIds(Array.from(set));
    }


    const getChildren = (identifier) => {
      const content = info.filter(child => identifier.includes(child.id)).map(childData => childData);
      console.log("getChildren")
      return content;
    }

    const handleRename = (id, newName) => {
      console.log("handle rename")
      info.find(child => {
        if(child.id === id){
          child.name = newName;
        }
      })
    }



  function handleDelete(prop){
    console.log("handle delete")
    const child = info.filter(child => child.id === prop)
    const children = info.filter(element => element.id !== prop && !child[0].children.includes(element.id));
    children.map(element => {
      if(element.children.includes(prop)){
        element.children.splice(element.children.indexOf(prop), 1)
      }
    }); 
    setInfo(children)
    
    sendData()

    /*
    delete middleware for deleteFolder or deleteDocument
    */
  }


  function handleAdd(id, name, type){
    console.log("handle add")
    const children = info;
    const new_id = crypto.randomUUID()
    if (type === "folder"){
    children.push({id: new_id, name: name, children: []})
    } else {
      children.push({id: new_id, name: name, owner: `~${window.ship}` })
    }
    children.map(child => {
      if(child.id === id){
        child.children.push(new_id)
      }
    })
    setInfo(children)
    sendData()
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
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(" ", "-"),
      children: [],
    };

    createFolder(meta).then((res) => {
      console.log("create folder result", res);
    });
    setInfo(([...info, meta]))
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
    setInfo(([...info, meta]))
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


  function createFol() {
    const testFolder = { id: `~${window.ship}-${crypto.randomUUID()}`, name: "Test Folder", content: [] };
    console.log("creating folder: ", testFolder);
    createFolder(testFolder);
    listFolders().then((res) => {
      console.log(res);
    });
  }

  function deleteFol(folder) {
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
        <i className="ri-checkbox-blank-circle-fill icon"
          style={
            urbitStatus.connection < 2
              ? {
                  color: "var(--status-success-color)",
                  width: "1.26em",
                  height: "1.26em",
                }
              : {
                  color: "var(--status-failure-color)",
                  width: "1.26em",
                  height: "1.26em",
                }
          }
        />
      </div>
      <div className="flex flex-col overflow-auto">
        <div className="mt-4 tree-item">
          <div className="font-bold flex-grow py-1">Your Ship</div>
          <menu onMouseLeave = {()=>(setAppear(false))}>
          <i className="ri-add-box-line icon clickable tree-item-hidden"
            onClick={(e) => {setAppear(true); setPos({top: e.clientY, left: e.clientX}); e.stopPropagation()}}
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

          {info.filter((child => !(ids.includes(child.id)))).map((childData, index) => (
                            <div
                            className=" pl-3"
                            onClick={() => { if(childData.child) {
                              openDocument(childData);}
                            }}
                          >    
                <TreeComponent key = {childData.id} data = {childData} onDelete = {handleDelete} getChildren = {getChildren} handleAdd = {handleAdd} createChild = {createChild} handleRename ={handleRename} />
                </div>
            ))}
      </div>
    </div>
  );
  

}

export default Sidebar;