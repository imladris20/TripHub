import { scheduleStore } from "../../store/store";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";
import TimeSettingModal from "./TimeSettingModal";

const AttractionRow = ({
  attraction,
  duration,
  attractionIndex,
  daySequenceIndex,
}) => {
  const {
    attractionsData,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
  } = scheduleStore();

  const { name, note, expense, inDayOrder, daySequence, poisId } = attraction;

  const handleAttractionNameClicked = (attractionName, note, expense) => {
    const targetData = attractionsData.find(
      (data) => data.name === attractionName,
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
        duration={duration}
        attractionIndex={attractionIndex}
        name={name}
      />
      <InDayOrderDropdown
        daySequenceIndex={daySequenceIndex}
        name={name}
        attractionIndex={attractionIndex}
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
