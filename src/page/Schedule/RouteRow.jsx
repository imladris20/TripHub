import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { scheduleStore } from "../../store/store";

const RouteRow = ({ poisId, routesPartnerIndex }) => {
  const map = useMap("tripMap");
  const { DirectionsService, DirectionsRenderer } = useMapsLibrary("routes");
  const { currentLoadingTripData } = scheduleStore();

  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer({ map: map });

  const [directionsResult, setDirectionsResult] = useState();

  useEffect(() => {
    if (
      currentLoadingTripData &&
      !directionsResult &&
      directionsService &&
      directionsRenderer
    ) {
      console.log("activate");
      console.log(directionsRenderer);
      console.log(directionsRenderer.setDirections);

      directionsRenderer.setDirections(null);
      const directionsRequest = {
        origin: { placeId: poisId },
        destination: {
          placeId:
            currentLoadingTripData.attractions[routesPartnerIndex].poisId,
        },
        travelMode: "DRIVING",
      };

      directionsService.route(directionsRequest, (result, status) => {
        console.log(status);
        console.log(directionsRequest);
        if (status == "OK") {
          directionsRenderer.setDirections(result);
          setDirectionsResult(result);
        }
      });
    }
  }, [currentLoadingTripData]);

  return directionsResult ? (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-center border-b border-solid border-gray-500 bg-white">
      點我設定交通
    </div>
  ) : (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-center border-b border-solid border-gray-500 bg-white">
      <span className="loading loading-bars loading-sm"></span>
    </div>
  );
};

export default RouteRow;
