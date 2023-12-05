import { scheduleStore } from "../../store/store";
import AttractionRow from "./AttractionRow";

const DayBlock = ({ daySequenceIndex }) => {
  const { currentTripDuration, currentLoadingTripData } = scheduleStore;

  const generateAttractions = (daySequenceIndex, duration) => {
    let attractions = currentLoadingTripData?.attractions;

    const arr = attractions.map((attraction, attractionIndex) => {
      const { daySequence } = attraction;

      if (
        (daySequence > duration && daySequenceIndex === 0) ||
        daySequence === daySequenceIndex
      ) {
        return (
          <AttractionRow
            key={attractionIndex}
            daySequenceIndex={daySequenceIndex}
            currentAttraction={attraction}
            currentAttractionIndex={attractionIndex}
          />
        );
      }

      if (daySequence !== daySequenceIndex) {
        return;
      }
    });

    return arr;
  };

  return (
    <>
      <div
        key={daySequenceIndex}
        className="flex w-[350px] flex-row items-center justify-center border-b border-dotted border-gray-200 bg-gray-500 py-3"
      >
        <h1 className="text-base font-bold tracking-widest text-gray-100">
          {daySequenceIndex === 0 ? "未分配的景點" : `第${daySequenceIndex}天`}
        </h1>
        {}
      </div>
      <div className="flex w-[350px] flex-col border-b border-solid border-gray-500 bg-white">
        <div className="flex w-[350px] flex-row items-center justify-start">
          <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
            分配
          </span>
          <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
            順序
          </span>
          <span className="h-full w-[83px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs">
            時間
          </span>
          <span className="h-full w-[187px] p-2 text-center text-xs">
            景點名稱
          </span>
        </div>
      </div>
      {generateAttractions(daySequenceIndex, currentTripDuration)}
    </>
  );
};

export default DayBlock;
