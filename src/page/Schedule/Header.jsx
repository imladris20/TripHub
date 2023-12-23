import { addDays, format } from "date-fns";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { cloneDeep } from "lodash";
import { forwardRef, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useStore, { scheduleStore } from "../../store/store";
import { PlayButtonIcon } from "../../utils/icons";

const Header = forwardRef((_, ref) => {
  const {
    currentLoadingTripId,
    setCurrentTripDuration,
    currentLoadingTripData,
    setAttractionItemDetail,
    setCurrentLoadingTripId,
  } = scheduleStore();

  const [startDate, setStartDate] = useState(
    currentLoadingTripData?.startDate || "",
  );
  const [endDate, setEndDate] = useState(currentLoadingTripData?.endDate || "");

  const { database } = useStore();
  const uid = localStorage.getItem("uid");

  const removeRef = useRef();

  const handleRemoveSchedule = async () => {
    const docRef = doc(database, "users", uid, "trips", currentLoadingTripId);

    await deleteDoc(docRef);

    setCurrentLoadingTripId(null);
    ref.current.showModal();
  };

  const calculateDayCount = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const secondGap = end - start;
    const count = Math.ceil(secondGap / (1000 * 60 * 60 * 24)) + 1;
    return count;
  };

  const handleStartDateInput = async (e) => {
    const newStartDate = e.target.value;
    const docRef = doc(database, "users", uid, "trips", currentLoadingTripId);

    let startTime = [];

    if (currentLoadingTripData.startTime) {
      startTime = cloneDeep(currentLoadingTripData.startTime);
    }

    if (endDate && endDate < newStartDate) {
      toast.error("起始日期不可晚於結束日期", {
        duration: 1500,
        position: "top-right",
        className: "bg-gray-200",
      });
      setStartDate(newStartDate);
      const defaultEndDate = format(addDays(newStartDate, 2), "yyyy-MM-dd");
      setEndDate(defaultEndDate);
      setCurrentTripDuration(3);

      await setDoc(
        docRef,
        {
          dayCount: 3,
          startDate: newStartDate,
          endDate: defaultEndDate,
          startTime: [
            ...Array(3).fill({
              value: "09:00",
              haveSetted: false,
            }),
          ],
        },
        { merge: true },
      );
      return;
    }

    setStartDate(newStartDate);

    const newDayCount = calculateDayCount(newStartDate, endDate);

    setCurrentTripDuration(newDayCount);

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
    } else {
      const defaultEndDate = format(addDays(newStartDate, 2), "yyyy-MM-dd");
      setEndDate(defaultEndDate);
      setCurrentTripDuration(3);
      await setDoc(
        docRef,
        {
          dayCount: 3,
          startDate: newStartDate,
          endDate: defaultEndDate,
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
    setStartDate(currentLoadingTripData?.startDate || "");
    setEndDate(currentLoadingTripData?.endDate || "");
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

        <div className="ml-2 flex flex-col items-center justify-center gap-1">
          <button
            className="cursor-pointer text-[10px] text-gray-500 underline decoration-gray-500 decoration-solid"
            onClick={() => {
              setAttractionItemDetail(null);
              ref.current.showModal();
            }}
          >
            編輯其他行程
          </button>

          <button
            className="cursor-pointer text-[10px] text-gray-500 underline decoration-gray-500 decoration-solid"
            onClick={() => {
              setAttractionItemDetail(null);
              removeRef.current.showModal();
            }}
          >
            刪除當前行程
          </button>
        </div>

        {startDate && endDate && (
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
        )}
      </div>
      <Toaster />
      <dialog ref={removeRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            確定要刪除「{currentLoadingTripData.name}」嗎？
          </h3>
          <p className="py-4">請留意刪除行程將同步使行程分享連結失效。</p>
          <div className="modal-action mt-4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2 h-9 min-h-0">再想想</button>
              <button
                className="btn h-9 min-h-0 bg-sand"
                onClick={() => handleRemoveSchedule()}
              >
                確定移出
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  ) : (
    <span className="loading loading-bars loading-md"></span>
  );
});

export default Header;
