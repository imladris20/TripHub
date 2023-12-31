import { cloneDeep } from "lodash";
import { scheduleStore } from "../../store/store";
import { VerticalSwapIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb";

const InDayOrderDropdown = ({
  daySequenceIndex,
  name,
  inDayOrder,
  currentAttractionIndex,
}) => {
  const { attractionsData: allAttractions, currentLoadingTripData } =
    scheduleStore();

  const generateInDayOrderDropdown = (daySequenceIndex, name) => {
    if (allAttractions && currentLoadingTripData?.attractions) {
      const filterAttractions = allAttractions.filter(
        (item) => item.daySequence === daySequenceIndex,
      );

      const currentOrder =
        currentLoadingTripData.attractions[currentAttractionIndex]?.inDayOrder;

      return [...Array(filterAttractions.length + 1)].map((_, optionIndex) => {
        if (optionIndex !== 0) {
          const isOccupied = currentLoadingTripData.attractions.some(
            (item) =>
              item.inDayOrder === optionIndex &&
              item.daySequence === daySequenceIndex,
          );

          if (isOccupied) {
            return;
          }
        }

        return (
          optionIndex !== currentOrder && (
            <li key={optionIndex}>
              <button
                onClick={() =>
                  handleDropdownOptionClicked(name, currentOrder, optionIndex)
                }
              >
                {optionIndex !== 0 ? `設為第${optionIndex}項` : "重設順序"}
              </button>
            </li>
          )
        );
      });
    }
  };

  const handleDropdownOptionClicked = async (name, currentOrder, newOrder) => {
    if (currentOrder !== newOrder) {
      const newAttractions = cloneDeep(currentLoadingTripData.attractions);

      newAttractions[currentAttractionIndex].inDayOrder = newOrder;
      newAttractions[currentAttractionIndex].duration = 60;
      newAttractions[currentAttractionIndex].travelMode = "DRIVING";

      newAttractions.sort((a, b) => a.inDayOrder - b.inDayOrder);

      const newDocData = { attractions: newAttractions };

      await db.updateDoc("currentTrip", newDocData);
    }
  };

  return daySequenceIndex !== 0 ? (
    <div className="dropdown dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="btn m-0 h-8 min-h-0 w-[40px] rounded-none border-b-0 border-l-0 border-r border-t-0 border-solid border-gray-400 bg-white p-0 text-xs"
      >
        {inDayOrder && inDayOrder !== 0 ? (
          <span className="h-full w-[40px] whitespace-nowrap p-2 text-center text-xs">
            {inDayOrder}
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-4 w-4 stroke-gray-700 stroke-2"
          >
            <VerticalSwapIcon />
          </svg>
        )}
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {generateInDayOrderDropdown(daySequenceIndex, name)}
      </ul>
    </div>
  ) : (
    <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
      -
    </span>
  );
};

export default InDayOrderDropdown;
