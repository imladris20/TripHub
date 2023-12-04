import { useRef, useState } from "react";
import { scheduleStore } from "../../store/store";
import { TimeIcon } from "../../utils/icons";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";

const AttractionRow = ({ attraction, duration, attractionIndex }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const {
    attractionsData,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
  } = scheduleStore();

  const timeEditModalRef = useRef();

  const { name, note, expense } = attraction;

  const handleStartTimeInput = (e) => {
    console.log("Start time", typeof e.target.value, e.target.value);
    setStartTime(e.target.value);
  };

  const handleEndTimeInput = (e) => {
    console.log("End time", typeof e.target.value, e.target.value);
    setEndTime(e.target.value);
  };

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
      />
      <InDayOrderDropdown />

      {/* time(modal) */}
      <span className="h-full w-[83px] shrink-0 whitespace-nowrap border-r border-solid border-gray-500 text-center text-xs">
        <button
          className="btn btn-ghost h-full min-h-0 w-full rounded-none font-normal"
          onClick={() => timeEditModalRef.current.showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-4 w-4 stroke-gray-700 stroke-2"
          >
            <TimeIcon />
          </svg>
        </button>
        <dialog ref={timeEditModalRef} className="modal">
          <div className="modal-box relative">
            <div className="flex flex-col items-start justify-start gap-2">
              <h3 className="mb-4 text-lg font-bold">
                想要在{name}停留多久呢？
              </h3>
              <h1 className="text-base">起始時間：</h1>
              <input
                type="time"
                step="60"
                className="input input-bordered w-full max-w-xs"
                value={startTime}
                onChange={(e) => handleStartTimeInput(e)}
              />
              <h1 className="text-base">結束時間：</h1>
              <input
                type="time"
                step="60"
                className="input input-bordered w-full max-w-xs"
                value={endTime}
                onChange={(e) => handleEndTimeInput(e)}
              />
            </div>
            <div className="absolute bottom-6 right-6">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-secondary">確認</button>
              </form>
            </div>
          </div>
        </dialog>
      </span>

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
