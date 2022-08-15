import { useContext, useState, useEffect } from "react";
import { SlideContext } from "../toolbar/SlideContext";
import {
  listDocuments,
  createDocument,
  checkUrbitWindow,
  deleteDocument,
} from "../urbit/index";
import { OpenDocumentEvent } from "../workspace/types";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Y from "yjs";
import FileTree from "./FileTree";

import { UrbitContext } from "../urbit/UrbitProvider";

function Sidebar() {
  const { slide, setSlide } = useContext(SlideContext);
  const urbitStatus = useContext(UrbitContext);

  const [list, setList] = useState([]);

  useEffect(() => {
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

  function openDocument(doc: any) {
    console.log("opening doc:", doc);
    document.dispatchEvent(OpenDocumentEvent(doc));
  }

  const [newDoc, setNewDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  function createDoc() {
    console.log("create doc");
    checkUrbitWindow();
    const meta: DocumentMeta = {
      owner: `~${window.ship}`,
      id: `~${window.ship}-${crypto.randomUUID()}`,
      name: newDocName.replaceAll(' ', '-')
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
    setList([meta, ...list]);
    closeCreateDoc();
  }
  function closeCreateDoc() {
    setNewDoc(false);
    setNewDocName("");
  }

  function deleteDoc(doc, index) {
    console.log("deleting document:", doc);
    list.splice(index, 1)
    setList([...list])
    deleteDocument(doc).then((res) => {
      console.log("delete document result:", res);
    });
  }

  /*
  return (
    <div className={`${slide ? " w-8" : " w-5"} duration-300 relative`}>
      <FileTree />
    </div>
  );
  */
  return (
    <div className="flex flex-col" style={{ width: "18vw", minWidth: "280px" }}>
      <div className="px-4 py-3 flex items-center">
        <div className="azimuth">~{urbitStatus.ship}</div>
        <div className="flex-grow"> </div>
        <FontAwesomeIcon icon={solid('circle')} className="icon" style={urbitStatus.connection < 2 ? {color: "var(--status-success-color)"} : { color: "var(--status-failure-color)"} }/>
      </div>
      <div className="flex flex-col overflow-auto">
      <div className="mt-4 tree-item">
        <div className="font-bold flex-grow py-1">Your Ship</div>
        <FontAwesomeIcon
          onClick={() => setNewDoc(true)}
          icon={regular("plus-square")}
          className="icon clickable tree-item-hidden"
        />
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
	      if(event.key == "Enter") createDoc();
	      if(event.key == "Esc") closeCreateDoc();
	    }}
          />
          <FontAwesomeIcon
            onClick={createDoc}
            icon={regular("check-square")}
            className="icon clickable"
          />
          <FontAwesomeIcon
            onClick={closeCreateDoc}
            icon={regular("square-xmark")}
            className="icon clickable"
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
	        deleteDoc(doc, i)
	      }}
	      icon={regular("trash-alt")}
	      className="icon clickable tree-item-hidden"
	    />
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Sidebar;
