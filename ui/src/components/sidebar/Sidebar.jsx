import { useContext, useState, useEffect } from "react";
import { SlideContext } from "../toolbar/SlideContext";
import {
  listDocuments,
  createDocument,
  checkUrbitWindow,
} from "../urbit/index";
import { OpenDocumentEvent } from "../workspace/types";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
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
          ...Object.keys(res).map((key) => {
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
    console.log(list);
  });

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
      name: newDocName,
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

  /*
  return (
    <div className={`${slide ? " w-8" : " w-5"} duration-300 relative`}>
      <FileTree />
    </div>
  );
  */
  return (
    <div className="flex flex-col" style={{ width: "18vw", minWidth: "280px" }}>
      <div className="px-4 py-3 flex">
        <div className="azimuth">~{urbitStatus.ship}</div>
        <div className="flex-grow"> </div>
        <div className="icon">{urbitStatus.connection}</div>
      </div>
      <div className="mt-4 px-4 py-2 flex">
        <div className="font-bold flex-grow py-1">Your Ship</div>
        <FontAwesomeIcon
          onClick={() => setNewDoc(true)}
          icon={regular("plus-square")}
          className="icon clickable"
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
      {list.map((doc) => {
        return (
          <div
            className="px-4 py-2 clickable"
            onClick={() => {
              openDocument(doc);
            }}
          >
            {doc.name}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
