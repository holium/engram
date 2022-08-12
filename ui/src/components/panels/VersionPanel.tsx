import { useState, useEffect } from "react";
import { Patp } from "@urbit/http-api";
import { Version } from "../workspace/types";
import ShipLabel from "./ShipLabel";

function VersionPanel(props: { show: boolean }) {
  const [versions, setVersions] = useState([
    { timestamp: new Date(0), ship: "~zod", snapshot: null },
    { timestamp: new Date(1), ship: "~bus", snapshot: null },
    { timestamp: new Date(3), ship: "~nut", snapshot: null },
  ]);

  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const ships = new Set();
    versions.forEach((version: Version) => {
      ships.add(version.ship);
    });
    setContributors(Array.from(ships));
  }, [versions]);

  console.log(versions);
  console.log(contributors);

  return (
    <div className="panel" style={props.show ? {} : { display: "none" }}>
      <div>
        <div
          className="text-pallet-0 text-pallet-1 text-pallet-2 text-pallet-3 text-pallet-4 text-pallet-5 text-pallet-6 text-pallet-7 text-pallet-8 text-pallet-9 text-pallet-10 text-pallet-11 text-pallet-12 text-pallet-13 text-pallet-14 text-pallet-15 text-pallet-16"
          style={{ color: "var(--type-color)" }}
        >
          History
        </div>
        {contributors.map((contributor: Patp) => {
          return (
            <ShipLabel
              ship={contributor}
              ships={contributors}
              key={contributor}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VersionPanel;
