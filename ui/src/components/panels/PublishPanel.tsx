import { useState } from "react";

function PublishPanel(props: { show: boolean }) {
  const [members, setMembers] = useState(["~dalsyr-diglyn"]);
  const [owner, setOwner] = useState("dalsyr-diglyn");
  const [newMember, setNewMember] = useState("");

  function addMember() {
    // poke
    console.log("Add member: ", newMember);
    setMembers([newMember, ...members]);
    setNewMember("");
  }

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div className="">
        <div className="flex gap-3 py-2">
          <div className="flex-grow">Owner:</div>
          <div className="azimuth">~zod</div>
        </div>
        <div className="py-2">
          <div className="border-b border-type">Members: </div>
        </div>
        {members.map((member: string) => {
          return (
            <div className="flex gap-3 py-1 items-center">
              <div className="azimuth">{member}</div>
              <div className="flex-grow"></div>
              {owner == (window as any).ship && (
                <div className="border rounded-1 clickable border-accent px-2 py-1">
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
