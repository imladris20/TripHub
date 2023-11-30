import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import useStore, { poisStore } from "../../store/store";

const CityFilter = () => {
  const { database, taiwanCities } = useStore();
  const { setCurrentPois } = poisStore();

  const uid = localStorage.getItem("uid");

  const [selectedCity, setSelectedCity] = useState("");

  const poisColRef = collection(database, "users", uid, "pointOfInterests");

  const handleSelectedCityChange = async (e) => {
    setSelectedCity(e.target.value);
    if (e.target.value === "顯示全部縣市") {
      console.log("all");
      const q = query(poisColRef);
      const newArr = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        newArr.push({ id: doc.id, data: doc.data() });
      });
      setCurrentPois(newArr);
    } else {
      const q = query(poisColRef, where("city", "==", e.target.value));
      const newArr = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        newArr.push({ id: doc.id, data: doc.data() });
      });
      setCurrentPois(newArr);
    }
  };

  return (
    <div className="flex h-10 w-full flex-row items-center justify-start border-2 border-dashed border-violet-200 bg-white outline-none">
      <select
        className="h-full w-full outline-none"
        value={selectedCity}
        onChange={(e) => handleSelectedCityChange(e)}
      >
        <option value="顯示全部縣市">顯示全部縣市</option>
        {taiwanCities.map((city, index) => {
          return (
            <option key={index} value={city}>
              {city}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CityFilter;
