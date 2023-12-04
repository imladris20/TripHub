import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import { VerticalSwapIcon } from "../../utils/icons";

const InDayOrderDropdown = ({ daySequenceIndex }) => {
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTrip } = scheduleStore();
  const [allAttractions, setAllAttractions] = useState([]);

  //  listener of loading newest data of selected trip
  useEffect(() => {
    if (database && currentLoadingTrip) {
      const unsubscribe = onSnapshot(
        doc(database, "users", uid, "trips", currentLoadingTrip),
        (doc) => {
          setAllAttractions(doc.data().attractions);
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [database, currentLoadingTrip]);

  const generateInDayOrderDropdown = (daySequenceIndex) => {
    if (allAttractions) {
      const filterAttractions = allAttractions.filter(
        (item) => item.daySequence === daySequenceIndex,
      );
      console.log(
        `how many item in day ${daySequenceIndex}: `,
        filterAttractions.length,
      );

      return [...Array(filterAttractions.length)].map((_, index) => {
        return (
          <li key={index}>
            <button onClick={() => console.log(daySequenceIndex)}>
              {index !== 0 ? `移至第${index}天` : "testing"}
            </button>
          </li>
        );
      });
    }
  };

  return (
    <div className="w-[40px dropdown dropdown-hover h-8">
      <div
        tabIndex={0}
        role="button"
        className="btn m-0 h-8 min-h-0 w-[40px] rounded-none border-b-0 border-l-0 border-r border-t-0 border-solid border-gray-400 bg-white p-0 text-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-4 w-4 stroke-gray-700 stroke-2"
        >
          <VerticalSwapIcon />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {generateInDayOrderDropdown(daySequenceIndex)}
      </ul>
    </div>
  );
};

export default InDayOrderDropdown;
