import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import { AddToPoisIcon, AlreadyAddedPoisIcon } from "../../utils/icons";

const ResultList = () => {
  const { placeResult, database } = useStore();
  // const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // let labelIndex = 0;
  const uid = localStorage.getItem("uid");
  const [isInPoisArr, setIsInPoisArr] = useState(new Array(20).fill(false));

  const handleAddToPoisBtnClicked = (place) => {
    const docData = {
      name: place.name,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      address: place.formatted_address || "not provided",
      phoneNumber: place.formatted_phone_number || "not provided",
      rating: place.rating || "not provided",
      ratingTotal: place.user_ratings_total || "not provided",
      priceLevel: place.price_level || "not provided",
    };

    setDoc(
      doc(database, `users/${uid}/pointOfInterests`, place.place_id),
      docData,
      {
        merge: true,
      },
    );
  };

  useEffect(() => {
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
            console.log(`${result.data().name} is already in collection`);
            return true;
          } else {
            console.log("It's not in Pois");
            return false;
          }
        }),
      );

      console.log(result);

      setIsInPoisArr(result);
    };

    updateIsInPoisArr();
  }, [placeResult]);

  return (
    <div className="justify-start-start flex h-full w-full flex-col overflow-auto">
      {placeResult.map((place, index) => {
        return (
          <div
            key={place.place_id}
            className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
          >
            <button>
              <h1 className="mb-0 text-left text-lg font-bold">{place.name}</h1>
            </button>
            <h2 className="text-xs">
              {place.rating} ⭐ ({place.user_ratings_total}則)
            </h2>
            <h2 className="text-xs">{place.formatted_address}</h2>
            {place?.opening_hours?.weekday_text ? (
              <div className="flex flex-col gap-[1px]">
                <h3 className="text-xs">營業時間</h3>
                {place.opening_hours.weekday_text.map((day, index) => {
                  return (
                    <h3
                      className="text-[10px]"
                      key={`weekday_${place.place_id}_${index}`}
                    >
                      {day}
                    </h3>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-[1px]">
                <h3 className="text-[10px]">🤔 店家未提供詳細營業資訊</h3>
              </div>
            )}
            <h2 className="text-xs">
              {place.formatted_phone_number
                ? `電話：${place.formatted_phone_number}`
                : "店家未提供連絡電話"}
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
                    return "🤔 店家未提供價位參考";
                }
              })()}
            </h2>
            {/* <h3>{labels[labelIndex++ % labels.length]}</h3> */}
            {!isInPoisArr[index] ? (
              <button
                className="absolute bottom-2 right-2 h-8 w-8"
                onClick={() => handleAddToPoisBtnClicked(place)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-8 w-8 fill-orange-200 stroke-slate-600 stroke-2"
                >
                  <AddToPoisIcon />
                </svg>
              </button>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="absolute bottom-2 right-2 h-8 w-8 fill-green-200 stroke-slate-500 stroke-2"
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
