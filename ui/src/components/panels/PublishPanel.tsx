import { useState, useEffect } from "react";
import { getDocumentSettings, setWhitelist, pathParser } from "../urbit/index";

function PublishPanel(props: { path: string; show: boolean }) {
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState();
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    const parsed = props.path.match(pathParser);
    const meta = {
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    };
    setOwner(parsed.groups.owner);
    getDocumentSettings(meta).then((res) => {
      console.log("set settings result", res);
    });
  }, []);

  function addMember() {
    // poke
    console.log("Add member: ", newMember);
    if ((window as any).ship == owner) {
      const whitelist = [newMember, ...members];
      setNewMember("");
      setWhitelist(whitelist)
        .then((res) => {
          console.log("set whitelist result: ", res);
          setMembers([...res]);
        })
        .catch(() => {
          console.warn("you are not the owner");
        });
    }
  }

  function removeMember(index) {
    console.log("Remove member: ", index);
    if ((window as any).ship == owner) {
      const whitelist = whitelist.splice(index, 1);
      setNewMember("");
      setWhitelist(whitelist)
        .then((res) => {
          console.log("set whitelist result: ", res);
          setMembers([...res]);
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
        <div className="py-2">
          <div className="border-b border-type">Whitelist: </div>
        </div>
        {members.map((member: string, i: number) => {
          return (
            <div className="flex gap-3 py-1 items-center">
              <div className="azimuth">{member}</div>
              <div className="flex-grow"></div>
              {owner == (window as any).ship && (
                <div
                  className="border rounded-1 clickable border-accent px-2 py-1"
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
              className="py-1 px-2 flex-grow clickable outline-none rounded-1"
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
