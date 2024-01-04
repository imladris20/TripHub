import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import globalStore, { scheduleStore } from "../../store/store";
import { db } from "../../utils/tripHubDb";
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
  const { database, uid } = globalStore();

  const map = useMap("tripMap");
  const { Marker } = useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");

  const markerRef = useRef([]);

  //  listener of loading newest data of selected trip
  useEffect(() => {
    if (!database || !currentLoadingTripId) return;

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
          const { daySequence, note, expense, poisId } = attraction;
          const docSnap = await db.getDocWithParams("poi", attraction.poisId);
          if (docSnap) {
            return { ...docSnap, daySequence, note, expense, poisId };
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
          label: {
            text: `${daySequence !== 0 ? `D${daySequence}` : "-"}`,
            color: "white",
          },
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
    <>
      {[...Array((currentTripDuration || 0) + 1)].map((_, daySequenceIndex) => {
        return (
          <DayBlock
            key={daySequenceIndex}
            daySequenceIndex={daySequenceIndex}
          />
        );
      })}
      {!currentLoadingTripData?.dayCount && (
        <div className="flex h-full flex-row items-center justify-center">
          <div className="chat chat-start">
            <div className="chat-bubble h-20 w-80 text-sm leading-[30px]">
              想開始分配景點嗎？ <br />
              先去上方設定好起始日期跟結束日期吧！
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1>你的行程空空如也~</h1>
      <h1>去口袋清單加入一些景點進來吧！</h1>
    </div>
  );
};

export default List;
