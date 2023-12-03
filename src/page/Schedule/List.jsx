import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";

const List = () => {
  const {
    currentLoadingTrip,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
    currentTripDuration,
    setCurrentTripDuration,
  } = scheduleStore();
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const [trip, setTrip] = useState();
  const map = useMap("tripMap");
  const { AdvancedMarkerElement, PinElement, Marker } =
    useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");
  const [attractionsData, setAttractionsData] = useState([]);

  const markerRef = useRef([]);

  const handleAttractionNameClicked = (attractionName, note, expense) => {
    const targetData = attractionsData.find(
      (data) => data.name === attractionName,
    );
    if (targetData) {
      setAttractionItemDetail({ ...targetData, note, expense });
      setCurrentCenter(targetData.location);
      setCurrentZoom(18);
    }
  };

  //  listener of loading newest data of selected trip
  useEffect(() => {
    if (database && currentLoadingTrip) {
      const unsubscribe = onSnapshot(
        doc(database, "users", uid, "trips", currentLoadingTrip),
        (doc) => {
          setTrip(doc.data());
          setCurrentTripDuration(doc.data()?.dayCount || 0);
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [database, currentLoadingTrip]);

  //  Add markers of attractions in trip on map
  useEffect(() => {
    const generateMarker = async () => {
      if (markerRef.current.length) {
        markerRef.current.forEach((marker) => {
          marker.setVisible(false);
          marker.setMap(null);
        });
        markerRef.current = [];
      }

      const result = await Promise.all(
        trip.attractions.map(async (attraction) => {
          const { daySequence, note, expense } = attraction;
          const ref = doc(
            database,
            "users",
            uid,
            "pointOfInterests",
            attraction.poisId,
          );
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            return { ...docSnap.data(), daySequence, note, expense };
          }
        }),
      );

      setAttractionsData(result);

      console.log(result);

      result.map((item) => {
        const { location, name, rating, ratingTotal, address, daySequence } =
          item;

        const marker = new Marker({
          map,
          position: location,
          animation: 2,
          label: `${daySequence !== 0 ? `D${daySequence}` : "-"}`,
        });
        const windowContent = `
          <div class='flex flex-col h-auto w-auto gap-1 justify-start items-start'>
            <h1 class='text-base font-bold'>${name}</h1>
            <h2 className="text-xs">
              ${rating} ⭐ (${ratingTotal}則)
            </h2>
            <h2 className="text-xs">${address}</h2>
          </div>
        `;

        const infowindow = new InfoWindow({
          ariaLabel: name,
          content: windowContent,
        });

        marker.addListener("mouseover", () => {
          infowindow.open({
            anchor: marker,
            map,
          });
        });

        marker.addListener("mouseout", () => {
          infowindow.close();
        });

        markerRef.current.push(marker);
      });
    };
    if (trip?.attractions) {
      generateMarker();
    }
  }, [trip]);

  const generateAttractions = (daySequenceIndex, duration) => {
    const attractions = trip?.attractions;

    const arr = attractions.map((attraction, index) => {
      const { name, note, expense, daySequence } = attraction;

      if (
        (daySequence > duration && daySequenceIndex === 0) ||
        daySequence === daySequenceIndex
      ) {
        return (
          <div
            key={index}
            className="flex w-full flex-col border-b border-solid border-gray-500 bg-white"
          >
            <div className="flex w-full flex-row items-center justify-start">
              <span className="h-full w-[40px] whitespace-pre-wrap border-r border-solid border-gray-500 p-2 text-center text-xs">
                -
              </span>
              <span className="h-full w-[40px] border-r border-solid border-gray-500 p-2 text-center text-xs">
                -
              </span>
              <button
                className="h-full w-[176px] grow cursor-pointer border-r border-solid border-gray-500 p-2 text-center text-xs"
                onClick={() => handleAttractionNameClicked(name, note, expense)}
              >
                {attraction.name}
              </button>
            </div>
          </div>
        );
      }

      if (daySequence !== daySequenceIndex) {
        return;
      }
    });

    return arr;
  };

  const generateDayBlocks = () => {
    const arr = new Array(currentTripDuration + 1).fill("blank");
    return arr.map((_, daySequenceIndex) => {
      return (
        <React.Fragment key={daySequenceIndex}>
          <div
            key={daySequenceIndex}
            className="flex w-full flex-row items-center justify-center border-b border-dotted border-gray-200 bg-gray-500 py-3"
          >
            <h1 className="text-base text-gray-200">
              {daySequenceIndex === 0
                ? "未分配的景點"
                : `第${daySequenceIndex}天`}
            </h1>
            {}
          </div>
          <div className="flex w-full flex-col border-b border-solid border-gray-500 bg-white">
            <div className="flex w-full flex-row items-center justify-start">
              <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-xs">
                順序
              </span>
              <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-xs">
                時間
              </span>
              <span className="h-full w-[176px] border-r border-solid border-gray-500 p-2 text-center text-xs">
                景點名稱
              </span>
            </div>
          </div>
          {generateAttractions(daySequenceIndex, currentTripDuration)}
        </React.Fragment>
      );
    });
  };

  return trip?.attractions ? (
    <>
      {generateAttractions()}
      {generateDayBlocks()}
    </>
  ) : (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
};

export default List;
