import { doc, setDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useStore, { scheduleStore } from "../../store/store";
import { PlayButtonIcon } from "../../utils/icons";

const Header = ({ tripModalRef }) => {
  const {
    currentLoadingTripId,
    setCurrentTripDuration,
    currentLoadingTripData,
    setAttractionItemDetail,
  } = scheduleStore();

  const [startDate, setStartDate] = useState(
    currentLoadingTripData?.startDate || "",
  );
  const [endDate, setEndDate] = useState(currentLoadingTripData?.endDate || "");

  const { database } = useStore();
  const uid = localStorage.getItem("uid");

  const calculateDayCount = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const secondGap = end - start;
    const count = Math.ceil(secondGap / (1000 * 60 * 60 * 24)) + 1;
    return count;
  };

  const handleStartDateInput = async (e) => {
    if (endDate && endDate < e.target.value) {
      toast.error("起始日期不可晚於結束日期", {
        duration: 1500,
        position: "top-right",
        className: "bg-gray-200",
      });
      setStartDate(e.target.value);
      setEndDate("");
      return;
    }
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    const newDayCount = calculateDayCount(newStartDate, endDate);
    setCurrentTripDuration(newDayCount);
    const docRef = doc(database, "users", uid, "trips", currentLoadingTripId);

    let startTime = [];

    if (currentLoadingTripData.startTime) {
      startTime = cloneDeep(currentLoadingTripData.startTime);
    }

    if (newDayCount > startTime.length) {
      startTime = [
        ...cloneDeep(startTime),
        ...Array(newDayCount - startTime.length).fill({
          value: "09:00",
          haveSetted: false,
        }),
      ];
    } else if (newDayCount < startTime.length) {
      startTime = startTime.slice(0, newDayCount);
    }

    if (endDate) {
      await setDoc(
        docRef,
        {
          dayCount: newDayCount,
          startDate: newStartDate,
          endDate,
          startTime,
        },
        { merge: true },
      );
    }
  };

  const handleEndDateInput = async (e) => {
    if (!startDate) {
      toast.error("請先設定起始日期", {
        duration: 1500,
        position: "top-right",
        className: "bg-gray-200",
      });
      setEndDate("");
      return;
    }
    if (startDate && e.target.value < startDate) {
      toast.error("結束日期不可早於開始日期", {
        duration: 1500,
        position: "top-right",
        className: "bg-gray-200",
      });
      setEndDate("");
      return;
    }
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    const newDayCount = calculateDayCount(startDate, newEndDate);
    setCurrentTripDuration(newDayCount);
    const docRef = doc(database, "users", uid, "trips", currentLoadingTripId);

    let startTime = [];

    if (currentLoadingTripData.startTime) {
      startTime = cloneDeep(currentLoadingTripData.startTime);
    }

    if (newDayCount > startTime.length) {
      startTime = [
        ...cloneDeep(startTime),
        ...Array(newDayCount - startTime.length).fill({
          value: "09:00",
          haveSetted: false,
        }),
      ];
    } else if (newDayCount < startTime.length) {
      startTime = startTime.slice(0, newDayCount);
    }

    if (startDate) {
      await setDoc(
        docRef,
        {
          dayCount: newDayCount,
          startDate,
          endDate: newEndDate,
          startTime,
        },
        { merge: true },
      );
    }
  };

  useEffect(() => {
    setStartDate(currentLoadingTripData?.startDate);
    setEndDate(currentLoadingTripData?.endDate);
  }, [currentLoadingTripData]);

  return currentLoadingTripData ? (
    <>
      <div className="flex h-10 flex-row items-center justify-start ">
        <div className="flex h-full max-w-[238px] flex-row items-center rounded-l-lg border-2 border-solid border-sand px-3">
          <h1 className="max-w-[210px] truncate whitespace-nowrap text-sm font-bold text-slate-800">
            {currentLoadingTripData.name}
          </h1>
        </div>
        <div className="flex h-full flex-row items-center border-b-2 border-r-2 border-t-2 border-solid border-sand px-3">
          <h1 className="whitespace-nowrap text-sm font-bold text-slate-800">
            起始日：
          </h1>
          <input
            className="text-sm outline-none"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateInput(e)}
          />
        </div>
        <div className="flex h-full flex-row items-center rounded-r-lg border-b-2 border-r-2 border-t-2 border-solid border-sand px-3">
          <h1 className="whitespace-nowrap text-sm font-bold text-slate-800">
            結束日：
          </h1>
          <input
            className="text-sm outline-none"
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateInput(e)}
          />
        </div>

        <button
          className="ml-2 mt-5 cursor-pointer text-[10px] text-gray-500 underline decoration-gray-500 decoration-solid"
          onClick={() => {
            setAttractionItemDetail(null);
            tripModalRef.current.showModal();
          }}
        >
          重新選擇行程
        </button>

        <a
          className="btn ml-6 flex h-10 min-h-0 flex-row items-center bg-sand"
          href={`/overview/${currentLoadingTripId}`}
          target="_blank"
          onClick={() => {
            console.log(currentLoadingTripData);
          }}
        >
          <h1 className="text-sm leading-5 text-slate-800">預覽行程</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-slate-800 stroke-slate-800 stroke-1"
            viewBox="0 0 512 512"
          >
            <PlayButtonIcon />
          </svg>
        </a>
      </div>
      <Toaster />
    </>
  ) : (
    <span className="loading loading-bars loading-md"></span>
  );
};

export default Header;
