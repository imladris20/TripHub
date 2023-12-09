import { doc, updateDoc } from "firebase/firestore";
import { cloneDeep, filter, orderBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";
import { TimeIcon } from "../../utils/icons";

const TimeSettingModal = ({
  name,
  currentAttractionIndex,
  dayBlockRef,
  daySequenceIndex,
}) => {
  const modalRef = useRef();
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const { currentLoadingTripId, currentLoadingTripData } = scheduleStore();

  const initStartTime = () => {
    const n =
      currentLoadingTripData.attractions[currentAttractionIndex].inDayOrder;

    const filterAttractions = filter(
      currentLoadingTripData.attractions,
      ({ daySequence, inDayOrder }) => daySequence === 1 && inDayOrder > 0,
    );

    const sortedAttractions = orderBy(filterAttractions, "inDayOrder", "asc");

    if (n === 1) {
      return (
        currentLoadingTripData.startTime[daySequenceIndex - 1]?.value || ""
      );
    } else if (n > 1) {
      let totalDuration = 0;
      for (let i = 0; i < n - 1; i++) {
        if (sortedAttractions[i]?.duration) {
          totalDuration = totalDuration + sortedAttractions[i].duration;
        }
        if (sortedAttractions[i]?.routeDuration) {
          totalDuration = totalDuration + sortedAttractions[i].routeDuration;
        }
      }
      const result = addDurationToTime(
        currentLoadingTripData.startTime[daySequenceIndex - 1]?.value,
        totalDuration,
      );
      return result;
    }
  };

  const [startTime, setStartTime] = useState(() => initStartTime());

  const [stayHours, setStayHours] = useState(
    Math.floor(
      currentLoadingTripData.attractions[currentAttractionIndex].duration / 60,
    ),
  );

  const [stayMinutes, setStayMinutes] = useState(
    currentLoadingTripData.attractions[currentAttractionIndex].duration % 60,
  );

  const initEndTime = () => {
    const n =
      currentLoadingTripData.attractions[currentAttractionIndex].inDayOrder;

    const filterAttractions = filter(
      currentLoadingTripData.attractions,
      ({ daySequence, inDayOrder }) => daySequence === 1 && inDayOrder > 0,
    );

    const sortedAttractions = orderBy(filterAttractions, "inDayOrder", "asc");

    let totalDuration = 0;

    for (let i = 0; i < n; i++) {
      if (sortedAttractions[i]?.duration) {
        totalDuration = totalDuration + sortedAttractions[i].duration;
      }
      if (
        sortedAttractions[i]?.routeDuration &&
        sortedAttractions[i].inDayOrder !== n
      ) {
        totalDuration = totalDuration + sortedAttractions[i].routeDuration;
      }
    }
    const result = addDurationToTime(
      currentLoadingTripData.startTime[daySequenceIndex - 1]?.value,
      totalDuration,
    );
    return result;
  };

  const [endTime, setEndTime] = useState(() => initEndTime());

  const handleStayHoursInput = (e) => {
    setStayHours(e.target.value);
    const newEndTime = calculateEndTime(
      startTime,
      e.target.value,
      stayMinutes || 0,
    );

    if (!stayMinutes) {
      setStayMinutes(0);
    }
    setEndTime(newEndTime);
  };

  const handleStayMinutesInput = (e) => {
    setStayMinutes(e.target.value);
    const newEndTime = calculateEndTime(
      startTime,
      stayHours || 0,
      e.target.value,
    );
    if (!stayHours) {
      setStayHours(0);
    }
    setEndTime(newEndTime);
  };

  const handleConfirmSettingTime = async () => {
    if (startTime && endTime) {
      const tripRef = doc(
        database,
        "users",
        uid,
        "trips",
        currentLoadingTripId,
      );
      const newAttractions = cloneDeep(currentLoadingTripData.attractions);
      const duration = parseInt(stayHours) * 60 + parseInt(stayMinutes);
      newAttractions[currentAttractionIndex].duration = duration;
      await updateDoc(tripRef, { attractions: newAttractions });
    } else {
      window.alert("請設定完整再點選確認");
    }
  };

  const handleButtonClicked = () => {
    if (
      currentLoadingTripData.attractions[currentAttractionIndex].inDayOrder ===
      0
    ) {
      window.alert("請先設定景點順序");
      return;
    }

    if (!currentLoadingTripData.startTime[daySequenceIndex - 1].haveSetted) {
      dayBlockRef.current.showModal();
    } else {
      modalRef.current.showModal();
    }
  };

  useEffect(() => {
    setStartTime(() => initStartTime());
    setEndTime(() => initEndTime());
    setStayHours(
      Math.floor(
        currentLoadingTripData.attractions[currentAttractionIndex].duration /
          60,
      ),
    );
    setStayMinutes(
      currentLoadingTripData.attractions[currentAttractionIndex].duration % 60,
    );
  }, [currentLoadingTripData]);

  return (
    <span className="h-full w-[90px] shrink-0 whitespace-nowrap border-r border-solid border-gray-500 text-center text-xs">
      <button
        className="btn btn-ghost h-full min-h-0 w-full rounded-none font-normal"
        onClick={() => handleButtonClicked()}
      >
        {startTime &&
        endTime &&
        currentLoadingTripData.startTime[daySequenceIndex - 1].haveSetted ? (
          <h1 className="text-xs">{`${startTime} - ${endTime}`}</h1>
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
            <h1 className="text-base">起始時間：{startTime}</h1>
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
              {/* <button className="btn btn-warning">取消</button> */}
            </form>
          </div>
        </div>
      </dialog>
    </span>
  );
};

export default TimeSettingModal;

function calculateEndTime(start, hours, minutes) {
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
}

function addDurationToTime(startTime, duration) {
  const startTimeParts = startTime.split(":");
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);
  const startDate = new Date(0, 0, 0, startHours, startMinutes);

  startDate.setMinutes(startDate.getMinutes() + duration);

  const newHours = startDate.getHours();
  const newMinutes = startDate.getMinutes();

  const result = `${String(newHours).padStart(2, "0")}:${String(
    newMinutes,
  ).padStart(2, "0")}`;

  return result;
}

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
