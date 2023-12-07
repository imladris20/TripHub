import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import useStore, { scheduleStore } from "../../store/store";
import DayBlock from "./DayBlock";

const List = () => {
  const {
    currentLoadingTripId,
    currentTripDuration,
    setCurrentTripDuration,
    setAttractionsData,
    currentLoadingTripData,
    setCurrentLoadingTripData,
  } = scheduleStore();
  const { database } = useStore();

  const uid = localStorage.getItem("uid");

  const map = useMap("tripMap");
  const { Marker } = useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");

  const markerRef = useRef([]);

  //  listener of loading newest data of selected trip
  useEffect(() => {
    if (database && currentLoadingTripId) {
      const unsubscribe = onSnapshot(
        doc(database, "users", uid, "trips", currentLoadingTripId),
        (doc) => {
          setCurrentLoadingTripData(doc.data());
          setCurrentTripDuration(doc.data()?.dayCount || 0);
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [database, currentLoadingTripId]);

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
        currentLoadingTripData.attractions.map(async (attraction) => {
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

      result.map((item) => {
        const { location, name, rating, ratingTotal, address, daySequence } =
          item;

        const marker = new Marker({
          map,
          position: location,
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
    if (currentLoadingTripData?.attractions) {
      generateMarker();
    }
  }, [currentLoadingTripData]);

  return currentLoadingTripData?.attractions ? (
    [...Array(currentTripDuration + 1)].map((_, daySequenceIndex) => {
      return (
        <DayBlock key={daySequenceIndex} daySequenceIndex={daySequenceIndex} />
      );
    })
  ) : (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
};

export default List;
