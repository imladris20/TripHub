import { doc, updateDoc } from "firebase/firestore";
import useStore, { scheduleStore } from "../../store/store";
import { VerticalSwapIcon } from "../../utils/icons";

const InDayOrderDropdown = ({ daySequenceIndex, name, inDayOrder }) => {
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const {
    currentLoadingTripId,
    attractionsData: allAttractions,
    currentLoadingTripData,
  } = scheduleStore();

  const generateInDayOrderDropdown = (daySequenceIndex, name) => {
    if (allAttractions && currentLoadingTripData?.attractions) {
      const filterAttractions = allAttractions.filter(
        (item) => item.daySequence === daySequenceIndex,
      );

      const currentOrder = currentLoadingTripData.attractions.find(
        (item) => item.name === name,
      )?.inDayOrder;

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
                  handleDropdownOptionClicked(
                    name,
                    daySequenceIndex,
                    currentOrder,
                    optionIndex,
                  )
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

  const handleDropdownOptionClicked = async (
    name,
    daySequenceIndex,
    currentOrder,
    newOrder,
  ) => {
    // console.log(`${name}在第${daySequenceIndex}天的第${currentOrder}項`);
    // console.log(`想變更到第${newOrder}項`);

    if (currentOrder !== newOrder) {
      const tripRef = doc(
        database,
        "users",
        uid,
        "trips",
        currentLoadingTripId,
      );
      const newAttractions = currentLoadingTripData.attractions;
      const target = newAttractions.findIndex((item) => item.name === name);

      newAttractions[target].inDayOrder = newOrder;

      newAttractions.sort((a, b) => a.inDayOrder - b.inDayOrder);

      await updateDoc(tripRef, { attractions: newAttractions });
    }
  };

  return daySequenceIndex !== 0 ? (
    <div className="dropdown dropdown-hover h-8 w-[40px]">
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
