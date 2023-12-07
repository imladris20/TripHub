import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { scheduleStore } from "../../store/store";
import {
  BicycleIcon,
  CarIcon,
  MotorcycleIcon,
  TrainIcon,
  WalkingIcon,
} from "../../utils/icons";

const RouteRow = ({ poisId, routesPartnerIndex }) => {
  const map = useMap("tripMap");
  const { DirectionsService, DirectionsRenderer } = useMapsLibrary("routes");
  const { currentLoadingTripData } = scheduleStore();
  const [travelMode, setTravelMode] = useState("DRIVING");
  const dropdownRef = useRef();

  let directionsService = new DirectionsService();
  let directionsRenderer = new DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "black",
    },
  });

  const [directionsResult, setDirectionsResult] = useState();

  useEffect(() => {
    if (currentLoadingTripData && directionsService && directionsRenderer) {
      directionsRenderer.setDirections(null);
      const directionsRequest = {
        origin: { placeId: poisId },
        destination: {
          placeId:
            currentLoadingTripData.attractions[routesPartnerIndex].poisId,
        },
        travelMode: travelMode,
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status == "OK") {
          directionsRenderer.setOptions({
            directions: result,
          });
          setDirectionsResult(result);
          console.log(result.request);
          console.log(status, result.routes[0].legs[0]);
        }
      });
    }
  }, [currentLoadingTripData, travelMode]);

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

  return directionsResult ? (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <div className="flex h-full w-[40px] flex-row items-center justify-center">
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
      </div>
      <h1 className="flex h-8 w-[123px] flex-row items-center justify-center border-r border-dotted border-gray-500 text-xs">{`交通距離：${directionsResult.routes[0].legs[0].distance.text}`}</h1>
      <h1 className="flex h-8 w-[175px] flex-row items-center justify-center text-xs">{`交通時間：${directionsResult.routes[0].legs[0].duration.text}`}</h1>
    </div>
  ) : (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-center border-b border-solid border-gray-500 bg-white">
      <span className="loading loading-bars loading-sm"></span>
    </div>
  );
};

export default RouteRow;
