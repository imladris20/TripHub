import { scheduleStore } from "../../store/store";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";
import TimeSettingModal from "./TimeSettingModal";

const AttractionRow = ({
  currentAttraction,
  currentAttractionIndex,
  daySequenceIndex,
}) => {
  const {
    attractionsData: allAttractions,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
  } = scheduleStore();

  const { name, note, expense, inDayOrder, daySequence, poisId } =
    currentAttraction;

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

  return (
    <div className="flex w-[350px] flex-row items-center justify-start border-b border-solid border-gray-500 bg-white">
      <DaySequenceDropDown
        attractionIndex={currentAttractionIndex}
        name={name}
      />
      <InDayOrderDropdown
        daySequenceIndex={daySequenceIndex}
        name={name}
        inDayOrder={inDayOrder}
      />

      <TimeSettingModal name={name} />

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
