import { collection, getDocs, query, where } from "firebase/firestore";
import useStore, { poisStore } from "../../store/store";

const CityFilter = () => {
  const { database, taiwanCities } = useStore();
  const { setCurrentPois, selectedCity, setSelectedCity } = poisStore();
  const uid = localStorage.getItem("uid");
  const poisColRef = collection(database, "users", uid, "pointOfInterests");

  const handleSelectedCityChange = async (e) => {
    setSelectedCity(e.target.value);
    const newArr = [];
    let q;
    if (e.target.value === "顯示全部縣市") {
      q = query(poisColRef);
    } else {
      q = query(poisColRef, where("city", "==", e.target.value));
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      newArr.push({ id: doc.id, data: doc.data() });
    });
    setCurrentPois(newArr);
  };

  return (
    <div className="flex h-10 w-full cursor-pointer flex-row items-center justify-start border-b-2 border-dashed border-violet-200 bg-white outline-none">
      <select
        className="h-full w-full cursor-pointer text-sm text-violet-600 outline-none"
        value={selectedCity}
        onChange={(e) => handleSelectedCityChange(e)}
      >
        <option className="text-black" value="顯示全部縣市">
          顯示全部縣市
        </option>
        {taiwanCities.map((city, index) => {
          return (
            <option className="text-black" key={index} value={city}>
              {city}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CityFilter;
