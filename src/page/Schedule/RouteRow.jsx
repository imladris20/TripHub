import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { cloneDeep, filter, orderBy } from "lodash";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import TravelTypeDropdown from "./TravelTypeDropDown";

const RouteRow = ({
  poisId,
  routesPartnerIndex,
  currentAttractionIndex,
  daySequenceIndex,
}) => {
  const map = useMap("tripMap");
  const { DirectionsService, DirectionsRenderer } = useMapsLibrary("routes");
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTripData, currentLoadingTripId } = scheduleStore();
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

      directionsService.route(directionsRequest, async (result, status) => {
        if (status == "OK") {
          directionsRenderer.setOptions({
            directions: result,
          });
          setDirectionsResult(result);
          const minutes = Math.round(
            result.routes[0].legs[0].duration.value / 60,
          );
          // console.log(`${Math.floor(minutes / 60)}小時${minutes % 60}分鐘`);

          const tripRef = doc(
            database,
            "users",
            uid,
            "trips",
            currentLoadingTripId,
          );
          const docSnap = await getDoc(tripRef);
          const newAttractions = cloneDeep(docSnap.data().attractions);
          newAttractions[currentAttractionIndex].routeDuration = minutes;
          newAttractions[currentAttractionIndex].travelMode = travelMode;

          await updateDoc(tripRef, { attractions: newAttractions });
        }
      });
    }
  }, [currentLoadingTripData, travelMode]);

  const initStartTime = () => {
    const n =
      currentLoadingTripData.attractions[currentAttractionIndex].inDayOrder;

    const filterAttractions = filter(
      currentLoadingTripData.attractions,
      ({ daySequence, inDayOrder }) => daySequence === 1 && inDayOrder > 0,
    );

    const sortedAttractions = orderBy(filterAttractions, "inDayOrder", "asc");

    let totalDuration = 0;
    for (let i = 0; i < n; i++) {
      if (sortedAttractions[i]?.duration) {
        totalDuration = totalDuration + sortedAttractions[i].duration;
      }
      if (sortedAttractions[i]?.routeDuration && i > 0) {
        totalDuration = totalDuration + sortedAttractions[i].routeDuration;
      }
    }
    const result = addDurationToTime(
      currentLoadingTripData.startTime[daySequenceIndex - 1]?.value,
      totalDuration,
    );
    return result;
  };

  const [startTime, setStartTime] = useState(() => initStartTime());

  const initEndTime = () => {
    const n =
      currentLoadingTripData.attractions[currentAttractionIndex].inDayOrder;

    const filterAttractions = filter(
      currentLoadingTripData.attractions,
      ({ daySequence, inDayOrder }) => daySequence === 1 && inDayOrder > 0,
    );

    const sortedAttractions = orderBy(filterAttractions, "inDayOrder", "asc");

    let totalDuration = 0;

    for (let i = 0; i < n; i++) {
      if (sortedAttractions[i]?.duration) {
        totalDuration = totalDuration + sortedAttractions[i].duration;
      }
      if (sortedAttractions[i]?.routeDuration) {
        totalDuration = totalDuration + sortedAttractions[i].routeDuration;
      }
    }
    const result = addDurationToTime(
      currentLoadingTripData.startTime[daySequenceIndex - 1]?.value,
      totalDuration,
    );
    return result;
  };

  const [endTime, setEndTime] = useState(() => initEndTime());

  useEffect(() => {
    setStartTime(() => initStartTime());
    setEndTime(() => initEndTime());
  }, [currentLoadingTripData]);

  return directionsResult ? (
    <div className="flex h-8 w-[350px] shrink-0 flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <div className="flex h-full w-[40px] flex-row items-center justify-center">
        <TravelTypeDropdown
          travelMode={travelMode}
          setTravelMode={setTravelMode}
        />
      </div>
      <h1 className="flex h-8 w-[123px] flex-row items-center justify-center border-r border-solid border-gray-500 text-xs">
        {`${startTime} - ${endTime}`}
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

function addDurationToTime(startTime, duration) {
  console.log(duration);
  console.log(startTime);
  const startTimeParts = startTime.split(":");
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);
  const startDate = new Date(0, 0, 0, startHours, startMinutes);

  startDate.setMinutes(startDate.getMinutes() + duration);

  const newHours = startDate.getHours();
  const newMinutes = startDate.getMinutes();

  const result = `${String(newHours).padStart(2, "0")}:${String(
    newMinutes,
  ).padStart(2, "0")}`;

  return result;
}
