import { useMap } from "@vis.gl/react-google-maps";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import globalStore from "../../store/store";
import { AlreadyAddedPoisIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb.js";

const ResultList = () => {
  const {
    placeResult,
    setSearchItemDetailInfo,
    setCurrentCenter,
    setCurrentZoom,
  } = globalStore();
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;
  const [isInPoisArr, setIsInPoisArr] = useState(new Array(20).fill(false));
  const map = useMap("searchMap");

  const handleItemClicked = (place, label, isInPois) => {
    setSearchItemDetailInfo({
      data: place,
      label,
      isInPois,
    });

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    map.panTo({ lat, lng });
    setCurrentCenter({ lat, lng });
    setCurrentZoom(18);
  };

  useEffect(() => {
    const query = db.poisCollection();
    const unsubscribe = onSnapshot(query, () => {
      const updateIsInPoisArr = async () => {
        const result = await Promise.all(
          placeResult.map(async (place) => {
            const result = await db.getDocWithParams("poi", place?.place_id);

            if (!result || result?.archived) {
              return false;
            } else {
              return true;
            }
          }),
        );

        setIsInPoisArr(result);
      };
      updateIsInPoisArr();
    });
    return () => {
      unsubscribe();
    };
  }, [placeResult]);

  return (
    <div className="justify-start-start flex h-full w-full flex-col overflow-auto">
      {placeResult.map((place, index) => {
        const label = labels[labelIndex++ % labels.length];
        return (
          <div
            key={place.place_id}
            onClick={() => handleItemClicked(place, label, isInPoisArr[index])}
            className="relative flex w-full cursor-pointer flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
          >
            <div className="flex w-full flex-row items-center justify-start gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 flex-row items-center justify-center rounded-full border border-dotted border-red-500 p-0 ">
                <h1 className="text-sm text-red-500">{label}</h1>
              </div>
              <h1 className="mb-0 truncate text-left text-lg font-bold">
                {place.name}
              </h1>
            </div>
            <h2 className="text-xs">
              {place.rating} ⭐ ({place.user_ratings_total}則)
            </h2>
            <h2 className="max-w-[210px] truncate text-xs">
              {place.formatted_address}
            </h2>
            <h2 className="text-xs">
              {(() => {
                switch (place.price_level) {
                  case 1:
                    return "💰 200元以下 / 人";
                  case 2:
                    return "💰💰 200~400元 / 人";
                  case 3:
                    return "💰💰💰 400~800元 / 人";
                  case 4:
                    return "💰💰💰💰 800~1600元 / 人";
                  default:
                    return "";
                }
              })()}
            </h2>
            {isInPoisArr[index] && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="absolute bottom-2 right-2 h-6 w-6 fill-green-200 stroke-slate-500 stroke-2"
              >
                <AlreadyAddedPoisIcon />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResultList;
