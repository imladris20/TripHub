import { doc, updateDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import useStore, { scheduleStore } from "../../store/store";
import { MenuIcon } from "../../utils/icons";

const DaySequenceDropdown = ({ currentAttractionIndex, name }) => {
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTripId, currentTripDuration, currentLoadingTripData } =
    scheduleStore();

  const handleDropdownOptionClicked = async (
    newDaySequence,
    currentAttractionIndex,
  ) => {
    const newAttractions = cloneDeep(currentLoadingTripData?.attractions);

    if (newAttractions) {
      const tripRef = doc(
        database,
        "users",
        uid,
        "trips",
        currentLoadingTripId,
      );

      newAttractions[currentAttractionIndex].daySequence = newDaySequence;
      newAttractions[currentAttractionIndex].inDayOrder = 0;
      newAttractions[currentAttractionIndex].routeDuration = 0;
      newAttractions[currentAttractionIndex].duration = 60;
      newAttractions[currentAttractionIndex].travelMode = "DRIVING";

      await updateDoc(tripRef, { attractions: newAttractions });
    }
  };

  const generateDaySequenceDropdownList = (
    duration,
    currentAttractionIndex,
  ) => {
    if (currentLoadingTripData?.attractions) {
      const currentDaySequence = currentLoadingTripData.attractions.find(
        (item) => item.name === name,
      )?.daySequence;

      return [...Array(duration + 1)].map((_, optionIndex) => {
        return (
          optionIndex !== currentDaySequence && (
            <li key={optionIndex}>
              <button
                onClick={() =>
                  handleDropdownOptionClicked(
                    optionIndex,
                    currentAttractionIndex,
                  )
                }
              >
                {optionIndex !== 0 ? `移至第${optionIndex}天` : "移回未分配"}
              </button>
            </li>
          )
        );
      });
    }
  };

  return (
    <details className="dropdown h-8 w-[40px]">
      <summary className="btn m-0 h-8 min-h-0 w-[40px] rounded-none border-b-0 border-l-0 border-r border-t-0 border-solid border-gray-400 bg-white p-0 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-4 w-4 stroke-gray-700 stroke-2"
        >
          <MenuIcon />
        </svg>
      </summary>
      <ul className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
        {generateDaySequenceDropdownList(
          currentTripDuration,
          currentAttractionIndex,
        )}
      </ul>
    </details>
  );
};

export default DaySequenceDropdown;
