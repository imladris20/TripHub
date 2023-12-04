import { doc, getDoc, updateDoc } from "firebase/firestore";
import useStore, { scheduleStore } from "../../store/store";
import { MenuIcon } from "../../utils/icons";

const DaySequenceDropdown = ({ duration, attractionIndex }) => {
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTrip } = scheduleStore();

  const handleDaySequenceDropdownOptionClicked = async (
    newDaySequence,
    attractionIndex,
  ) => {
    const tripRef = doc(database, "users", uid, "trips", currentLoadingTrip);
    const docSnap = await getDoc(tripRef);
    const newAttractions = { ...docSnap.data() }.attractions;

    newAttractions[attractionIndex].daySequence = newDaySequence;

    await updateDoc(tripRef, { attractions: newAttractions });
  };

  const generateDaySequenceDropdownList = (duration, attractionIndex) => {
    return [...Array(duration + 1)].map((_, index) => {
      return (
        <li key={index}>
          <button
            onClick={() =>
              handleDaySequenceDropdownOptionClicked(index, attractionIndex)
            }
          >
            {index !== 0 ? `移至第${index}天` : "移回未分配"}
          </button>
        </li>
      );
    });
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
          <MenuIcon />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {generateDaySequenceDropdownList(duration, attractionIndex)}
      </ul>
    </div>
  );
};

export default DaySequenceDropdown;
