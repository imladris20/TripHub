import { useRef, useState } from "react";
import { scheduleStore } from "../../store/store";
import { TimeIcon } from "../../utils/icons";
import DaySequenceDropDown from "./DaySequenceDropdown";
import InDayOrderDropdown from "./InDayOrderDropdown";

const AttractionRow = ({
  attraction,
  duration,
  attractionIndex,
  daySequenceIndex,
}) => {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("");
  const [stayHours, setStayHours] = useState("");
  const [stayMinutes, setStayMinutes] = useState("");

  const {
    attractionsData,
    setAttractionItemDetail,
    setCurrentCenter,
    setCurrentZoom,
  } = scheduleStore();

  const timeEditModalRef = useRef();

  const { name, note, expense, inDayOrder, daySequence, poisId } = attraction;

  const handleStartTimeInput = (e) => {
    console.log("Start time", typeof e.target.value, e.target.value);
    setStartTime(e.target.value);
  };

  const handleStayHoursInput = (e) => {
    console.log(
      `我打算待${e.target.value}小時${
        stayMinutes || 0
      }分鐘, e.target.value 類型是${typeof e.target.value}`,
    );
    setStayHours(e.target.value);
    const newEndTime = calculateEndTime(
      startTime,
      e.target.value,
      stayMinutes || 0,
    );
    setEndTime(newEndTime);
  };

  const handleStayMinutesInput = (e) => {
    console.log(
      `我打算待${stayHours || 0}小時${
        e.target.value
      }分鐘, e.target.value 類型是${typeof e.target.value}`,
    );
    setStayMinutes(e.target.value);
    const newEndTime = calculateEndTime(startTime, stayHours, e.target.value);
    setEndTime(newEndTime);
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

  const calculateEndTime = (start, hours, minutes) => {
    const startHours = parseInt(start.split(":")[0], 10);
    const startMinutes = parseInt(start.split(":")[1], 10);
    const stayHoursNum = parseInt(hours, 10);
    const stayMinutesNum = parseInt(minutes, 10);

    const endHours = startHours + stayHoursNum;
    const endMinutes = startMinutes + stayMinutesNum;

    const endTime = new Date(0, 0, 0, endHours, endMinutes);

    const stringifyEndTime =
      endTime.getHours().toString().padStart(2, "0") +
      ":" +
      endTime.getMinutes().toString().padStart(2, "0");
    return stringifyEndTime;
  };

  const handleConfirmSettingTime = () => {
    console.log(`起始時間為${startTime}`);
    console.log(`停留長度為${stayHours}時${stayMinutes}分`);
    console.log(`結束時間為${endTime}`);
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
                className="input input-bordered h-6 w-44 max-w-xs p-0 pl-1"
                value={startTime}
                onChange={(e) => handleStartTimeInput(e)}
              />
              <h1 className="mt-4 text-base">停留長度：</h1>
              <div className="flex flex-row items-center justify-start gap-2">
                <input
                  type="number"
                  className="input input-bordered h-6 w-11 max-w-xs p-0 pl-2"
                  placeholder="-"
                  min={0}
                  max={23}
                  value={stayHours}
                  onChange={(e) => handleStayHoursInput(e)}
                />
                <h1 className="text-base">小時</h1>
                <input
                  type="number"
                  className="input input-bordered h-6 w-11 max-w-xs p-0 pl-2"
                  placeholder="-"
                  min={0}
                  max={59}
                  value={stayMinutes}
                  onChange={(e) => handleStayMinutesInput(e)}
                />
                <h1 className="text-base">分鐘</h1>
              </div>
              <h1 className="mt-4 text-base">結束時間：{endTime}</h1>
            </div>
            <div className="absolute bottom-6 right-6">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmSettingTime()}
                >
                  確認
                </button>
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
