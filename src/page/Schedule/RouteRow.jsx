import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { scheduleStore } from "../../store/store";
import TravelTypeDropdown from "./TravelTypeDropDown";

const RouteRow = ({ poisId, routesPartnerIndex }) => {
  const map = useMap("tripMap");
  const { DirectionsService, DirectionsRenderer } = useMapsLibrary("routes");
  const { currentLoadingTripData } = scheduleStore();
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [directionsResult, setDirectionsResult] = useState();

  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "black",
    },
    preserveViewport: true,
  });

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

  return directionsResult ? (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <div className="flex h-full w-[40px] flex-row items-center justify-center">
        <TravelTypeDropdown
          travelMode={travelMode}
          setTravelMode={setTravelMode}
        />
      </div>
      <h1 className="flex h-8 w-[123px] flex-row items-center justify-center border-r border-solid border-gray-500 text-xs">
        08:00-09:00
      </h1>
      <h1 className="flex h-8 w-[187px] flex-row items-center justify-center text-xs">{`${directionsResult.routes[0].legs[0].duration.text}`}</h1>
    </div>
  ) : (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-center border-b border-solid border-gray-500 bg-white">
      <span className="loading loading-bars loading-sm"></span>
    </div>
  );
};

export default RouteRow;
