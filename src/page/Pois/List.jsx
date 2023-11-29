import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore from "../../store/store";

const List = () => {
  const { database } = useStore();
  const map = useMap("poisMap");
  const { Marker } = useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");
  const uid = localStorage.getItem("uid");
  const [currentPois, setCurrentPois] = useState();

  useEffect(() => {
    if (database) {
      const q = query(collection(database, "users", uid, "pointOfInterests"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newArr = [];

        querySnapshot.forEach((doc) => {
          newArr.push({ id: doc.id, data: doc.data() });
        });
        setCurrentPois(newArr);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [database]);

  useEffect(() => {
    if (currentPois) {
      currentPois.map((item) => {
        const {
          data: { location, name, rating, ratingTotal, address },
        } = item;

        const marker = new Marker({ map, position: location });

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
      });
    }
  }, [currentPois]);

  return (
    <div className="justify-start-start flex h-full w-full flex-col overflow-auto">
      {currentPois ? (
        currentPois.map((item) => {
          const {
            id,
            data: {
              address,
              name,
              phoneNumber,
              priceLevel,
              rating,
              ratingTotal,
            },
          } = item;
          return (
            <div
              key={id}
              className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
            >
              <button>
                <h1 className="mb-0 text-left text-lg font-bold">{name}</h1>
              </button>
              <h2 className="text-xs">
                {rating} ⭐ {ratingTotal}則
              </h2>
              <h2 className="text-xs">{address}</h2>
              <h2 className="text-xs">
                {phoneNumber ? `電話：${phoneNumber}` : "店家未提供連絡電話"}
              </h2>
              <h2 className="text-xs">
                {(() => {
                  switch (priceLevel) {
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
            </div>
          );
        })
      ) : (
        <div className="flex h-full flex-row items-center justify-center">
          <div className="h-[120px] w-[120px] animate-[spin_1.5s_linear_infinite] rounded-[50%] border-[16px] border-t-[16px] border-solid border-gray-300 border-t-[solid] border-t-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default List;
