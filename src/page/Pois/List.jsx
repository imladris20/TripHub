import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import useStore, { poisStore } from "../../store/store";

const List = () => {
  const { database, typeOptions, taiwanCities } = useStore();
  const { setCurrentZoom, setCurrentCenter, setPoisItemDetailInfo } =
    poisStore();
  const map = useMap("poisMap");
  const { Marker } = useMapsLibrary("marker");
  const { InfoWindow } = useMapsLibrary("maps");
  const uid = localStorage.getItem("uid");
  const [currentPois, setCurrentPois] = useState();
  const [selectedCity, setSelectedCity] = useState("");
  const markerRef = useRef([]);

  const poisColRef = collection(database, "users", uid, "pointOfInterests");

  useEffect(() => {
    if (database) {
      const q = query(poisColRef);

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

        markerRef.current.push(marker);
      });
    }
  }, [currentPois]);

  const handleItemClicked = (place) => {
    setPoisItemDetailInfo(place);
    setCurrentCenter(place.data.location);
    setCurrentZoom(18);
  };

  const handleSelectedCityChange = async (e) => {
    setSelectedCity(e.target.value);
    if (e.target.value === "全部顯示") {
      console.log("all");
      const q = query(poisColRef);
      const newArr = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        newArr.push({ id: doc.id, data: doc.data() });
      });
      setCurrentPois(newArr);
    } else {
      const q = query(poisColRef, where("city", "==", e.target.value));
      const newArr = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        newArr.push({ id: doc.id, data: doc.data() });
      });
      setCurrentPois(newArr);
    }
  };

  console.log(markerRef.current);

  return (
    <>
      <div className="flex h-10 w-full flex-row items-center justify-start border-2 border-dashed border-violet-200 bg-white outline-none">
        <h1 className="ml-1 whitespace-nowrap">篩選：</h1>
        <select
          className="h-full w-full outline-none"
          value={selectedCity}
          onChange={(e) => handleSelectedCityChange(e)}
        >
          <option value="全部顯示">全部顯示</option>
          {taiwanCities.map((city, index) => {
            return (
              <option key={index} value={city}>
                {city}
              </option>
            );
          })}
        </select>
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
                className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
              >
                <div className="flex w-full flex-row items-center justify-start gap-2">
                  {categories.map((category, index) => {
                    let color;
                    for (var i = 0; i < typeOptions.length; i++) {
                      if (typeOptions[i].name === category) {
                        color = typeOptions[i].bg;
                      }
                    }
                    color = color || "bg-gray-700";
                    return (
                      <div
                        key={index}
                        className={`flex h-4 w-1/4 flex-row items-center justify-center rounded-full ${color}`}
                      >
                        <h1 className="text-justify text-[10px] text-white">
                          {category}
                        </h1>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => handleItemClicked(item)}>
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
    </>
  );
};

export default List;