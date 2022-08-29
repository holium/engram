import { Patp } from "@urbit/http-api";
import { Version, getShipPallet } from "../document/types";

function VersionLabel(props: {
  ships: Array<Patp>;
  version: Version;
  present: Array<number>;
  view: () => void;
}) {
  const commitIndex = props.ships.indexOf(props.version.ship);
  return (
    <div className="flex" style={{ position: "relative", top: "-25px" }}>
      <div
        style={{
          width: "25px",
          height: "25px",
          top: "25px",
          position: "relative",
        }}
      >
        {commitIndex >= 0 && (
          <svg
            style={{ position: "absolute", top: "-6.5px", left: "0" }}
            width={`${50 + 25 * commitIndex}`}
            height="12.5"
            viewBox={`0 0 ${50 + 25 * commitIndex} 12.5`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M12.5 12.5 C12.5 0 ${37.5 + 25 * commitIndex} 12.5 ${
                37.5 + 25 * commitIndex
              } 0`}
              fill="none"
              stroke={getShipPallet(props.version.ship)}
              stroke-width="2px"
            />
          </svg>
        )}
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          xmlns="http://www.w3.org/2000/svg"
          onClick={props.view}
        >
          <path
            d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031L11.5 0C11.5 0 11.9805 0 12.5 0C13.0195 0 13.5 0 13.5 0L13.5 6.32031ZM16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z"
            fill="(--var-type-color)"
          />
        </svg>
      </div>
      {props.ships.map((ship, i) => {
        if (props.present[i] < 0) {
          return (
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          );
        }
        if (ship == props.version.ship) {
          if (props.present[i] == 0) {
            // Final Commit Node
            return (
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 18.6797C8.52734 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.52734 6.77344 11.5 6.32031V6.78003e-06C11.5 6.78003e-06 11.9805 0 12.5 0C13.0195 0 13.5 6.78003e-06 13.5 6.78003e-06V6.32031C16.5078 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.5078 18.2266 13.5 18.6797C13.5 18.6797 13.0195 18.75 12.5 18.75C11.9805 18.75 11.5 18.6797 11.5 18.6797ZM8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5Z"
                  fill={getShipPallet(ship)}
                />
              </svg>
            );
          } else {
            // Commit Node
            return (
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 6.32031C16.4727 6.77344 18.75 9.36719 18.75 12.5C18.75 15.6328 16.4727 18.2266 13.5 18.6797V25C13.5 25 13.0195 25 12.5 25C11.9805 25 11.5 25 11.5 25V18.6797C8.49219 18.2266 6.25 15.6328 6.25 12.5C6.25 9.36719 8.49219 6.77344 11.5 6.32031L11.5 0C11.5 0 11.9805 0 12.5 0C13.0195 0 13.5 0 13.5 0L13.5 6.32031ZM16.8 12.5C16.8 10.082 14.918 8.125 12.5 8.125C10.082 8.125 8.2 10.082 8.2 12.5C8.2 14.918 10.082 16.875 12.5 16.875C14.918 16.875 16.8 14.918 16.8 12.5Z"
                  fill={getShipPallet(ship)}
                />
              </svg>
            );
          }
        }
        // No Commit Node
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
      })}
      <div>
        {props.version.timestamp.getTime()} {props.version.ship}
      </div>
    </div>
  );
}

export default VersionLabel;
