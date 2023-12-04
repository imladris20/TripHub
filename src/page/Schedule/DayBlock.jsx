import AttractionRow from "./AttractionRow";

const DayBlock = ({ daySequenceIndex, currentTripDuration, trip }) => {
  const generateAttractions = (daySequenceIndex, duration) => {
    const attractions = trip?.attractions;

    const arr = attractions.map((attraction, attractionIndex) => {
      const { daySequence } = attraction;

      if (
        (daySequence > duration && daySequenceIndex === 0) ||
        daySequence === daySequenceIndex
      ) {
        return (
          <AttractionRow
            key={attractionIndex}
            attraction={attraction}
            duration={duration}
            attractionIndex={attractionIndex}
            daySequenceIndex={daySequenceIndex}
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
        <h1 className="text-base text-gray-200">
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
