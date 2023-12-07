import { useRef } from "react";
import {
  BicycleIcon,
  CarIcon,
  MotorcycleIcon,
  TrainIcon,
  WalkingIcon,
} from "../../utils/icons";

const switchTravelModeIcon = (travelMode) => {
  switch (travelMode) {
    case "WALKING": {
      return <WalkingIcon />;
    }
    case "BICYCLING": {
      return <BicycleIcon />;
    }
    case "TRANSIT": {
      return <TrainIcon />;
    }
    case "TWO_WHEELER": {
      return <MotorcycleIcon />;
    }
    default: {
      return <CarIcon />;
    }
  }
};

const TravelTypeDropdown = ({ travelMode, setTravelMode }) => {
  const dropdownRef = useRef();

  return (
    <details
      className="dropdown flex h-full w-[40px] flex-row items-center justify-center"
      ref={dropdownRef}
    >
      <summary className="btn m-0 h-8 min-h-0 w-[40px] rounded-none border-l-0 border-t-0 border-gray-500 bg-white p-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-6 w-6 stroke-black"
        >
          {switchTravelModeIcon(travelMode)}
        </svg>
      </summary>
      <ul className="menu dropdown-content z-[1] w-16 rounded-box bg-base-100 p-1 shadow">
        <li>
          <button
            onClick={() => {
              setTravelMode("WALKING");
              dropdownRef.current.open = !dropdownRef.current.open;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-black"
            >
              <WalkingIcon />
            </svg>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTravelMode("BICYCLING");
              dropdownRef.current.open = !dropdownRef.current.open;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-black"
            >
              <BicycleIcon />
            </svg>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTravelMode("TRANSIT");
              dropdownRef.current.open = !dropdownRef.current.open;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-black"
            >
              <TrainIcon />
            </svg>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTravelMode("TWO_WHEELER");
              dropdownRef.current.open = !dropdownRef.current.open;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-black"
            >
              <MotorcycleIcon />
            </svg>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setTravelMode("DRIVING");
              dropdownRef.current.open = !dropdownRef.current.open;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-black"
            >
              <CarIcon />
            </svg>
          </button>
        </li>
      </ul>
    </details>
  );
};

export default TravelTypeDropdown;
