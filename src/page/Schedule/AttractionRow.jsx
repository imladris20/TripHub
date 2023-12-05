import { doc, onSnapshot } from "firebase/firestore";
import { findIndex } from "lodash";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";
import TimeSettingModal from "./TimeSettingModal";

const AttractionRow = ({ currentAttraction, daySequenceIndex }) => {
  const {
    attractionsData: allAttractions,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
    currentLoadingTripData,
    currentLoadingTripId,
  } = scheduleStore();

  const { database } = useStore();
  const uid = localStorage.getItem("uid");

  const { name, note, expense, inDayOrder, daySequence, poisId } =
    currentAttraction;

  const [targetIndex, setTargetIndex] = useState(
    findIndex(currentLoadingTripData.attractions, {
      name: name,
    }),
  );

  const handleAttractionNameClicked = (
    currentAttractionName,
    note,
    expense,
  ) => {
    const targetData = allAttractions.find(
      (data) => data.name === currentAttractionName,
    );
    if (targetData) {
      setAttractionItemDetail({ ...targetData, note, expense });
      setCurrentCenter(targetData.location);
      setCurrentZoom(18);
    }
  };

  useEffect(() => {
    if (database && currentLoadingTripId) {
      const unsubscribe = onSnapshot(
        doc(database, "users", uid, "trips", currentLoadingTripId),
        (doc) => {
          setTargetIndex(
            findIndex(currentLoadingTripData.attractions, {
              name: name,
            }),
          );
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [database, currentLoadingTripId]);

  return (
    <div className="flex w-[350px] flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <DaySequenceDropDown currentAttractionIndex={targetIndex} name={name} />
      <InDayOrderDropdown
        name={name}
        inDayOrder={inDayOrder}
        daySequenceIndex={daySequenceIndex}
        currentAttractionIndex={targetIndex}
      />

      <TimeSettingModal name={name} currentAttractionIndex={targetIndex} />

      {/* name(button) */}
      <button
        className="h-full w-[187px] shrink-0 grow cursor-pointer p-2 text-center text-xs"
        onClick={() => handleAttractionNameClicked(name, note, expense)}
      >
        {name}
      </button>
    </div>
  );
};

export default AttractionRow;
