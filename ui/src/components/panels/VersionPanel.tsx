import { useState, useEffect } from "react";
import { getSnapshots, pathParser } from "../urbit/index";
import { Patp } from "@urbit/http-api";
import * as Y from "yjs";
import { Version } from "../document/types";
import ShipLabel from "./ShipLabel";
import VersionLabel from "./VersionLabel";

function VersionPanel(props: {
  show: boolean;
  path: string;
  renderSnapshot: (snapshot: Y.Snapshot) => void;
  closeSnapshot: () => void;
}) {
  const [versions, setVersions] = useState([]);

  const [viewing, setViewing] = useState(null);

  const [ships, setShips] = useState([]);
  const present = ships.map((ship) => {
    let latest = 0;
    versions.forEach((version, i) => {
      if (version.ship == ship) latest = i;
    });
    return latest;
  });

  function renderVersion(snapshot) {
    props.renderSnapshot(snapshot);
  }

  function closeVersion() {
    props.closeSnapshot();
  }

  useEffect(() => {
    console.log("getting snapshots from path:", props.path);
    const parsed = props.path.match(pathParser);
    const meta = {
      owner: parsed.groups.owner,
      id: parsed.groups.id,
      name: parsed.groups.name,
    };
    getSnapshots(meta).then((res) => {
      console.log("getting snapshots result:", res);
      setVersions(res);
    });
  }, [props.path]);

  useEffect(() => {
    const addys = new Set();
    versions.forEach((version: Version) => {
      addys.add(version.ship);
    });
    addys.delete((window as any).ship);
    setShips(Array.from(addys));
  }, [versions]);

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div>
        <div
          className="flex justify-between text-pallet-0 text-pallet-1 text-pallet-2 text-pallet-3 text-pallet-4 text-pallet-5 text-pallet-6 text-pallet-7 text-pallet-8 text-pallet-9 text-pallet-10 text-pallet-11 text-pallet-12 text-pallet-13 text-pallet-14 text-pallet-15 text-pallet-16"
          style={{ color: "var(--type-color)" }}
        >
          <div>History</div>
          <div className="px-2 py-1 clickable" onClick={closeVersion}>
            clear
          </div>
        </div>
        {ships.map((ship: Patp) => {
          return <ShipLabel ship={ship} ships={ships} key={ship} />;
        })}
        <div>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="12.5"
              x2="12.5"
              y2="25"
              stroke="var(--type-color)"
              stroke-width="2px"
            />
          </svg>
        </div>
        <div className="flex flex-col-reverse">
          {versions.map((version: Version, i) => {
            return (
              <VersionLabel
                ships={ships}
                version={version}
                present={present.map((latest: number) =>
                  i < latest ? 1 : i == latest ? 0 : -1
                )}
                viewing={viewing === i}
                view={() => {
                  if (i == viewing) {
                    setViewing(null);
                    closeVersion();
                  } else {
                    setViewing(i);
                    renderVersion(version.snapshot);
                  }
                }}
              />
            );
          })}
        </div>

        <div style={{ height: "25px" }}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            {viewing == null ? (
              <path
                d="M11.5 18.6797C8.52734 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.52734 6.77344 11.5 6.32031V6.78003e-06C11.5 6.78003e-06 11.9805 0 12.5 0C13.0195 0 13.5 6.78003e-06 13.5 6.78003e-06V6.32031C16.5078 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.5078 18.2266 13.5 18.6797C13.5 18.6797 13.0195 18.75 12.5 18.75C11.9805 18.75 11.5 18.6797 11.5 18.6797Z"
                fill="var(--type-color)"
              />
            ) : (
              <path
                d="M11.5 18.6797C8.52734 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.52734 6.77344 11.5 6.32031V6.78003e-06C11.5 6.78003e-06 11.9805 0 12.5 0C13.0195 0 13.5 6.78003e-06 13.5 6.78003e-06V6.32031C16.5078 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.5078 18.2266 13.5 18.6797C13.5 18.6797 13.0195 18.75 12.5 18.75C11.9805 18.75 11.5 18.6797 11.5 18.6797ZM8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5Z"
                fill="var(--type-color)"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default VersionPanel;
