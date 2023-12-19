import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { collection, onSnapshot, query } from "firebase/firestore";
import { find } from "lodash";
import { useEffect, useRef } from "react";
import useStore, { poisStore } from "../../store/store";
import BookMark from "./BookMark";
import CategoryFilter from "./CategoryFilter";
import CityFilter from "./CityFilter";

const List = () => {
  const { database, typeOptions } = useStore();
  const {
    setCurrentZoom,
    setCurrentCenter,
    setPoisItemDetailInfo,
    currentPois,
    setCurrentPois,
  } = poisStore();
  const map = useMap("poisMap");
  const { Marker } = useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");
  const uid = localStorage.getItem("uid");
  const markerRef = useRef([]);

  const poisColRef = collection(database, "users", uid, "pointOfInterests");

  useEffect(() => {
    if (database) {
      const q = query(poisColRef);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newArr = [];
        querySnapshot.forEach((doc) => {
          if (!doc.data()?.archived) {
            newArr.push({ id: doc.id, data: doc.data() });
          }
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
      if (markerRef.current.length) {
        markerRef.current.forEach((marker) => {
          marker.setVisible(false);
          marker.setMap(null);
        });
        markerRef.current = [];
      }
      currentPois.map((item) => {
        const {
          data: { location, name, rating, ratingTotal, address },
        } = item;

        const marker = new Marker({ map, position: location, animation: 2 });

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
    }
  }, [currentPois]);

  const handleItemClicked = (place) => {
    setPoisItemDetailInfo(place);
    map.panTo(place.data.location);
    setCurrentCenter(place.data.location);
    setCurrentZoom(18);
  };

  return (
    <>
      <div className="flex w-full flex-row items-center justify-start gap-2 bg-white">
        <CityFilter />
        <CategoryFilter />
      </div>
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
                categories,
              },
            } = item;

            return (
              <div
                key={id}
                onClick={() => handleItemClicked(item)}
                className="relative flex w-full cursor-pointer flex-col items-start gap-2 border-b-2 border-solid border-gray-200 bg-white p-2"
              >
                <div className="mt-2 flex w-full flex-row items-center justify-start gap-2">
                  {categories.map((category, index) => {
                    let bgColor;
                    let textColor;
                    bgColor = find(typeOptions, { name: category })?.bg;
                    textColor = find(typeOptions, { name: category })
                      ?.shouldTextDark
                      ? "text-slate-800"
                      : "text-slate-50";

                    return (
                      <div
                        key={index}
                        className={`badge badge-lg ${bgColor} py-2`}
                      >
                        <h1
                          className={`text-center text-xs font-bold ${textColor}`}
                        >
                          {category}
                        </h1>
                      </div>
                    );
                  })}
                </div>

                <h1 className="text mb-0 max-w-[290px] truncate text-left text-lg font-bold">
                  {name}
                </h1>

                <div className="flex flex-row items-end justify-start gap-2">
                  <h2 className="text-sm">
                    {ratingTotal !== "店家未提供"
                      ? `${rating} ⭐ ${ratingTotal}則`
                      : "尚無評價"}
                  </h2>
                  <h2 className="text-sm">|</h2>
                  <h2 className="text-xs leading-5">
                    {phoneNumber && `☎️ 電話：${phoneNumber}`}
                  </h2>
                </div>
                <h2 className="text-xs">🗺️ {address}</h2>
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
                        return;
                    }
                  })()}
                </h2>
                <BookMark id={id} />
              </div>
            );
          })
        ) : (
          <div className="mt-10 flex h-full flex-col items-center justify-start gap-10">
            <div className="flex w-52 flex-col gap-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
            <div className="flex w-52 flex-col gap-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
