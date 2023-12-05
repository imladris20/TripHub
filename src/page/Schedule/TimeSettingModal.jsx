import { doc, updateDoc } from "firebase/firestore";
import { cloneDeep, find } from "lodash";
import { useRef, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import { TimeIcon } from "../../utils/icons";

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

const TimeSettingModal = ({ name, currentAttractionIndex }) => {
  const modalRef = useRef();
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTripId, currentLoadingTripData } = scheduleStore();

  const [startTime, setStartTime] = useState(
    currentLoadingTripData.attractions[currentAttractionIndex].startTime ||
      addOneMinuteToTimeString(
        find(currentLoadingTripData.attractions, {
          inDayOrder:
            currentLoadingTripData.attractions[currentAttractionIndex]
              .inDayOrder - 1,
        })?.endTime,
      ) ||
      "",
  );
  const [stayHours, setStayHours] = useState(
    currentLoadingTripData.attractions[currentAttractionIndex].stayHours || "",
  );
  const [stayMinutes, setStayMinutes] = useState(
    currentLoadingTripData.attractions[currentAttractionIndex].stayMinutes ||
      "",
  );
  const [endTime, setEndTime] = useState(
    currentLoadingTripData.attractions[currentAttractionIndex].endTime || "",
  );

  const handleStartTimeInput = (e) => {
    setStartTime(e.target.value);
    if (stayHours || stayMinutes) {
      const newEndTime = calculateEndTime(
        e.target.value,
        stayHours || 0,
        stayMinutes || 0,
      );

      setEndTime(newEndTime);
    }
  };

  const handleStayHoursInput = (e) => {
    setStayHours(e.target.value);
    const newEndTime = calculateEndTime(
      startTime,
      e.target.value,
      stayMinutes || 0,
    );
    setEndTime(newEndTime);
  };

  const handleStayMinutesInput = (e) => {
    setStayMinutes(e.target.value);
    const newEndTime = calculateEndTime(startTime, stayHours, e.target.value);
    setEndTime(newEndTime);
  };

  const handleConfirmSettingTime = async () => {
    if (startTime && endTime && stayHours && stayMinutes) {
      const tripRef = doc(
        database,
        "users",
        uid,
        "trips",
        currentLoadingTripId,
      );
      const newAttractions = cloneDeep(currentLoadingTripData.attractions);

      newAttractions[currentAttractionIndex].startTime = startTime;
      newAttractions[currentAttractionIndex].stayHours = stayHours;
      newAttractions[currentAttractionIndex].stayMinutes = stayMinutes;
      newAttractions[currentAttractionIndex].endTime = endTime;

      await updateDoc(tripRef, { attractions: newAttractions });
    } else {
      window.alert("請設定完整再點選確認");
    }
  };

  function addOneMinuteToTimeString(timeString) {
    if (timeString) {
      const [hours, minutes] = timeString.split(":").map(Number);

      const totalMinutes = (hours * 60 + minutes + 1) % (24 * 60);

      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;

      const newTimeString = `${String(newHours).padStart(2, "0")}:${String(
        newMinutes,
      ).padStart(2, "0")}`;

      return newTimeString;
    }
  }

  return (
    <span className="h-full w-[83px] shrink-0 whitespace-nowrap border-r border-solid border-gray-500 text-center text-xs">
      <button
        className="btn btn-ghost h-full min-h-0 w-full rounded-none font-normal"
        onClick={() => {
          modalRef.current.showModal();
          console.log(currentAttractionIndex);
          console.log(`state的起始時間：${startTime}；state的結束時間：${endTime};
          state的時長：${stayHours}時${stayMinutes}分`);
        }}
      >
        {currentLoadingTripData.attractions[currentAttractionIndex].startTime &&
        currentLoadingTripData.attractions[currentAttractionIndex].endTime ? (
          <h1 className="text-[10px]">{`${startTime} 至 ${endTime}`}</h1>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-4 w-4 stroke-gray-700 stroke-2"
          >
            <TimeIcon />
          </svg>
        )}
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box relative">
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="mb-4 text-lg font-bold">想要在{name}停留多久呢？</h3>
            {currentLoadingTripData.attractions[currentAttractionIndex]
              .inDayOrder === 1 ? (
              <>
                <h1 className="text-base">起始時間：</h1>
                <input
                  type="time"
                  step="60"
                  className="input input-bordered h-6 w-44 max-w-xs p-0 pl-1"
                  value={startTime}
                  onChange={(e) => handleStartTimeInput(e)}
                />
              </>
            ) : (
              <h1 className="text-base">
                起始時間：
                {startTime}
              </h1>
            )}

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
              <button
                className="btn btn-secondary mr-4"
                onClick={() => handleConfirmSettingTime()}
              >
                確認
              </button>
              <button className="btn btn-warning">取消</button>
            </form>
          </div>
        </div>
      </dialog>
    </span>
  );
};

export default TimeSettingModal;
