import { Patp } from "@urbit/http-api";
import { getShipPallet } from "../workspace/types";

function ShipLabel(props: { ship: Patp; ships: Array<Patp> }) {
  return (
    <div className="flex items-center">
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
      {props.ships.map((ship) => {
        if (ship == props.ship) {
          return (
            <svg
              width="25"
              height="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
            >
              <path
                d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031C11.5 6.32031 11.9805 6.25 12.5 6.25C13.0195 6.25 13.5 6.32031 13.5 6.32031ZM16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z"
                fill={getShipPallet(ship)}
              />
            </svg>
          );
        } else if (
          props.ships.indexOf(ship) < props.ships.indexOf(props.ship)
        ) {
          return (
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
                stroke={getShipPallet(ship)}
                stroke-width="2px"
              />
            </svg>
          );
        } else {
          return (
            <svg
              width="25"
              height="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
            ></svg>
          );
        }
      })}
      <div className="azimuth">{props.ship}</div>
    </div>
  );
}

export default ShipLabel;
