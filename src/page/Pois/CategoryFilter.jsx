import { collection, getDocs, query, where } from "firebase/firestore";
import { produce } from "immer";
import { useState } from "react";
import useStore, { poisStore } from "../../store/store";
import { FilterIcon } from "../../utils/icons";

const CategoryFilter = () => {
  const {
    isFilterWindowOpen,
    setIsFilterWindowOpen,
    setCurrentPois,
    selectedCity,
  } = poisStore();
  const { database, typeOptions } = useStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const uid = localStorage.getItem("uid");
  const poisColRef = collection(database, "users", uid, "pointOfInterests");

  const handleCheckboxChanged = async (event) => {
    let keyCategories = [...selectedTags];
    if (event.target.checked) {
      setSelectedTags(
        produce((state) => {
          state.push(event.target.value);
        }),
      );
      keyCategories.push(event.target.value);
    } else {
      setSelectedTags(
        produce((state) => {
          state.splice(state.indexOf(event.target.value), 1);
        }),
      );
      keyCategories.splice(keyCategories.indexOf(event.target.value), 1);
    }

    const pois = [];
    let q;
    if (selectedCity === "顯示全部縣市" || selectedCity === "") {
      q = query(poisColRef);
    } else {
      q = query(poisColRef, where("city", "==", selectedCity));
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      pois.push({ id: doc.id, data: doc.data() });
    });

    if (keyCategories.length !== 0) {
      const filteredPois = pois.filter((place) => {
        const categories = place.data.categories;
        return keyCategories.some((q) => categories.includes(q));
      });
      setCurrentPois(filteredPois);
    } else {
      setCurrentPois(pois);
    }
  };

  return (
    <div className="relative flex h-10 w-full flex-row items-center justify-between border-b-2 border-dashed border-rose-200 bg-white px-2 outline-none">
      <h1
        className="cursor-pointer text-sm text-rose-500"
        onClick={() => setIsFilterWindowOpen()}
      >
        篩選類別
      </h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-3 w-3 cursor-pointer stroke-rose-400 stroke-2"
        onClick={() => setIsFilterWindowOpen()}
      >
        <FilterIcon />
      </svg>

      <div
        className={`absolute right-0 top-10 z-[99] h-[450px] w-[256px] bg-white px-5 pt-4 opacity-90 ${
          isFilterWindowOpen ? "block" : "hidden"
        }`}
      >
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
          {typeOptions.map((type, index) => {
            return (
              <div
                key={index}
                className="flex h-5 flex-row items-center justify-start gap-1"
              >
                <input
                  type="checkbox"
                  value={type.name}
                  className="h-[14px] w-[14px]"
                  onChange={(e) => handleCheckboxChanged(e)}
                />
                <span className="text-[14px]">{type.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
