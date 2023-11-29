import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import { AddToPoisIcon, AlreadyAddedPoisIcon } from "../../utils/icons";

const ResultList = () => {
  const {
    placeResult,
    database,
    setSearchItemDetailInfo,
    setCurrentCenter,
    setCurrentZoom,
  } = useStore();
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;
  const uid = localStorage.getItem("uid");
  const [isInPoisArr, setIsInPoisArr] = useState(new Array(20).fill(false));

  const handleItemClicked = (place, label) => {
    setSearchItemDetailInfo({
      data: place,
      label,
    });
    setCurrentCenter(place.geometry.location);
    setCurrentZoom(18);
  };

  useEffect(() => {
    const q = query(collection(database, "users", uid, "pointOfInterests"));
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const updateIsInPoisArr = async () => {
        const result = await Promise.all(
          placeResult.map(async (place, index) => {
            const docRef = doc(
              database,
              `users/${uid}/pointOfInterests`,
              place.place_id,
            );

            const result = await getDoc(docRef);

            if (result.exists()) {
              return true;
            } else {
              return false;
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
            className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
          >
            <button
              className="flex w-full flex-row items-center justify-start gap-2"
              onClick={() => handleItemClicked(place, label)}
            >
              <div className="flex h-5 w-5 flex-shrink-0 flex-row items-center justify-center rounded-full border border-dotted border-red-500 p-0 ">
                <h1 className="text-sm text-red-500">{label}</h1>
              </div>
              <h1 className="mb-0 text-left text-lg font-bold">{place.name}</h1>
            </button>
            <h2 className="text-xs">
              {place.rating} ⭐ ({place.user_ratings_total}則)
            </h2>
            <h2 className="text-xs">{place.formatted_address}</h2>
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
            {!isInPoisArr[index] ? (
              <button
                className="absolute bottom-2 right-2 h-6 w-6"
                onClick={() => handleItemClicked(place, label)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-6 w-6 fill-orange-200 stroke-slate-600 stroke-2"
                >
                  <AddToPoisIcon />
                </svg>
              </button>
            ) : (
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
