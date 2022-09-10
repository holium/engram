import { useState, useEffect } from "react";
import { getDocumentSettings, setDocumentSettings } from "../urbit/index";

function PublishPanel(props: { path: DocumentId; show: boolean }) {
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    getDocumentSettings(props.path).then((res) => {
      console.log("get settings result", res);
      setOwner(res.owner);
      setName(res.name);
      setMembers(Object.values(res.whitelist).map((ship) => "~" + ship));
    });
  }, [props.path]);

  function addMember() {
    // poke
    console.log("Add member: ", newMember);
    if (
      (window as any).ship == owner &&
      newMember.charCodeAt(0) == "~".charCodeAt(0)
    ) {
      const whitelist = [newMember, ...members];
      setNewMember("");
      setDocumentSettings(props.path, {
        name: name,
        owner: "~" + owner,
        perms: whitelist,
      })
        .then((res) => {
          console.log("set whitelist result: ", res);
          setMembers([...whitelist]);
        })
        .catch(() => {
          console.warn("you are not the owner");
        });
    }
  }

  function removeMember(index) {
    console.log("Remove member: ", index);
    if ((window as any).ship == owner) {
      const whitelist = members;
      whitelist.splice(index, 1);
      setNewMember("");
      setDocumentSettings(props.path, {
        name: name,
        owner: "~" + owner,
        perms: whitelist,
      })
        .then((res) => {
          console.log("set whitelist result: ", res);
          setMembers([...whitelist]);
        })
        .catch(() => {
          console.warn("you are not the owner");
        });
    }
  }

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div className="">
        <div className="flex gap-3 py-2">
          <div className="flex-grow">Owner:</div>
          <div className="azimuth">~{owner}</div>
        </div>
        <div className="flex gap-3 py-1">
          <div className="py-1 flex-shrink-0">Shareable Link:</div>
          <div
            className="px-2 py-1 rounded-2 border overflow-auto scrollbar-none flex-1 whitespace-nowrap"
            style={{ borderColor: "var(--type-color)" }}
          >
            {(window as any).ship}/{props.path.id}/{props.path.timestamp}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon clickable focus:shadow-sunk flex-shrink-0"
            fill="var(--type-color)"
            onClick={() => {
              navigator.clipboard.writeText(
                `${(window as any).ship}/${props.path.id}/${
                  props.path.timestamp
                }`
              );
            }}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z" />
          </svg>
        </div>
        <div className="py-2">
          <div className="border-b border-type">Whitelist: </div>
        </div>
        {members.map((member: string, i: number) => {
          return (
            <div className="flex gap-3 py-1 items-center">
              <div className="azimuth">{member}</div>
              <div className="flex-grow"></div>
              {owner == (window as any).ship && "~" + owner != member && (
                <div
                  className="border clickable px-2 rounded-2"
                  style={{ borderColor: "var(--type-color)" }}
                  onClick={() => {
                    removeMember(i);
                  }}
                >
                  remove
                </div>
              )}
            </div>
          );
        })}
        {owner == (window as any).ship && (
          <div className="flex gap-3 py-1">
            <input
              type="text"
              className="py-1 px-2 flex-grow outline-none border-b"
              style={{ borderColor: "var(--type-color)" }}
              placeholder="add member"
              value={newMember}
              onChange={(event) => {
                setNewMember(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key == "Enter") addMember();
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="var(--type-color)"
              onClick={() => {
                addMember();
              }}
              className="icon clickable"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm6.003 11L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublishPanel;
