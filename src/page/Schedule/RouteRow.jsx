import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { scheduleStore } from "../../store/store";

const RouteRow = ({ poisId, routesPartnerIndex }) => {
  const map = useMap("tripMap");
  const { DirectionsService, DirectionsRenderer } = useMapsLibrary("routes");
  const { currentLoadingTripData } = scheduleStore();

  let directionsService = new DirectionsService();
  let directionsRenderer = new DirectionsRenderer({
    map: map,
    suppressMarkers: true,
  });

  const [directionsResult, setDirectionsResult] = useState();

  useEffect(() => {
    if (
      currentLoadingTripData &&
      !directionsResult &&
      directionsService &&
      directionsRenderer
    ) {
      console.log(directionsRenderer);
      directionsRenderer.setDirections(null);
      const directionsRequest = {
        origin: { placeId: poisId },
        destination: {
          placeId:
            currentLoadingTripData.attractions[routesPartnerIndex].poisId,
        },
        travelMode: "TWO_WHEELER",
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
          setDirectionsResult(result);
          console.log(status, result.routes[0].legs[0]);
        }
      });
    }
  }, [currentLoadingTripData]);

  return directionsResult ? (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <h1 className="flex h-8 w-[163px] flex-row items-center justify-center border-r border-dotted border-gray-500 text-xs">{`交通距離：${directionsResult.routes[0].legs[0].distance.text}`}</h1>
      <h1 className="flex h-8 w-[175px] flex-row items-center justify-center text-xs">{`交通時間：${directionsResult.routes[0].legs[0].duration.text}`}</h1>
    </div>
  ) : (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-center border-b border-solid border-gray-500 bg-white">
      <span className="loading loading-bars loading-sm"></span>
    </div>
  );
};

export default RouteRow;
