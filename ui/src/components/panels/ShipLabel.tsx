import { Patp } from "@urbit/http-api";
import { getShipPallet } from "../workspace/types";

function ShipLabel(props: { ship: Patp; ships: Array<Patp> }) {
  return (
    <div className="flex">
      {props.ships.map((ship) => {
        return (
          <div
            style={{ width: "25px", height: "25px" }}
            key={ship}
            className={`text-pallet-${getShipPallet(ship)}`}
          >
            {ship == props.ship && (
              <svg
                width="25"
                height="25"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 25 25"
              >
                <circle cx="12.5" cy="12.5" r="6.25" />
              </svg>
            )}{" "}
          </div>
        );
      })}
      <div className="azimuth">{props.ship}</div>
    </div>
  );
}

export default ShipLabel;
