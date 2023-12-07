import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import AttractionRow from "./AttractionRow";

const DayBlock = ({ daySequenceIndex }) => {
  const { currentTripDuration, currentLoadingTripData, currentLoadingTripId } =
    scheduleStore();
  const { database } = useStore();
  const uid = localStorage.getItem("uid");

  const dayBlockRef = useRef();

  const [startTime, setStartTime] = useState(
    currentLoadingTripData.startTime[daySequenceIndex - 1] || "09:00",
  );

  const handleStartTimeInput = (e) => {
    setStartTime(e.target.value);
  };

  const handleConfirmStartTime = async (daySequenceIndex) => {
    const docRef = doc(database, "users", uid, "trips", currentLoadingTripId);
    const newStartTime = [...currentLoadingTripData.startTime];
    newStartTime[daySequenceIndex - 1] = startTime;
    await updateDoc(docRef, { startTime: newStartTime });
  };

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
          />
        );
      }

      if (daySequence !== daySequenceIndex) {
        return;
      }
    });

    return arr;
  };

  useEffect(() => {
    setStartTime(currentLoadingTripData.startTime[daySequenceIndex - 1]);
  }, [currentLoadingTripData]);

  return (
    <>
      <div
        key={daySequenceIndex}
        className={`flex w-[350px] flex-row items-center justify-center border-b border-dotted border-gray-200 ${
          daySequenceIndex === 0 ? "bg-gray-500" : "bg-deyork"
        } py-3`}
      >
        {daySequenceIndex === 0 ? (
          <h1 className="text-base font-bold tracking-widest text-gray-100">
            未分配的景點
          </h1>
        ) : (
          <h1
            className="cursor-pointer text-base font-bold tracking-widest text-gray-100"
            onClick={() => dayBlockRef.current.showModal()}
          >
            第{daySequenceIndex}天
          </h1>
        )}
        {}
      </div>
      <div className="flex w-[350px] flex-col border-b border-solid border-gray-500 bg-white">
        <div className="flex w-[350px] flex-row items-center justify-start">
          <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs font-bold">
            分配
          </span>
          <span className="h-full w-[40px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs font-bold">
            順序
          </span>
          <span className="h-full w-[83px] whitespace-nowrap border-r border-solid border-gray-500 p-2 text-center text-xs font-bold">
            時間
          </span>
          <span className="h-full w-[187px] p-2 text-center text-xs font-bold">
            景點名稱
          </span>
        </div>
      </div>
      {generateAttractions(daySequenceIndex, currentTripDuration)}
      <dialog ref={dayBlockRef} className="modal">
        <div className="modal-box relative">
          <h3 className="text-lg font-bold">
            第{daySequenceIndex}天想從幾點開始玩呢？
          </h3>
          <input
            type="time"
            step="60"
            className="input input-bordered input-sm mb-3 mt-4 w-full max-w-[205px]"
            value={startTime}
            onChange={(e) => handleStartTimeInput(e)}
          />
          <div className="modal-action absolute bottom-4 right-4">
            <form method="dialog">
              <button
                className="btn btn-secondary h-8 min-h-0"
                onClick={() => handleConfirmStartTime(daySequenceIndex)}
              >
                設定完成
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DayBlock;
