import { cloneDeep } from "lodash";
import { scheduleStore } from "../../store/store";
import { MenuIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb.js";

const DaySequenceDropdown = ({ currentAttractionIndex, name }) => {
  const { currentTripDuration, currentLoadingTripData } = scheduleStore();

  const handleDropdownOptionClicked = async (
    newDaySequence,
    currentAttractionIndex,
  ) => {
    const newAttractions = cloneDeep(currentLoadingTripData?.attractions);

    if (newAttractions) {
      newAttractions[currentAttractionIndex].daySequence = newDaySequence;
      newAttractions[currentAttractionIndex].inDayOrder = 0;
      newAttractions[currentAttractionIndex].routeDuration = 0;
      newAttractions[currentAttractionIndex].duration = 60;
      newAttractions[currentAttractionIndex].travelMode = "DRIVING";

      const newDocData = { attractions: newAttractions };

      await db.updateDoc("currentTrip", newDocData);
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

      return [...Array((duration || 0) + 1)].map((_, optionIndex) => {
        const showOptions = () => {
          handleDropdownOptionClicked(optionIndex, currentAttractionIndex);
        };

        return (
          optionIndex !== currentDaySequence && (
            <li key={optionIndex}>
              <button onClick={showOptions}>
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
