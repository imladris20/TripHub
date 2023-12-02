import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";

const Header = () => {
  const [currentTrip, setCurrentTrip] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { database } = useStore();
  const { currentLoadingTrip, tripSelectModal, setTripSelectModal } =
    scheduleStore();
  const uid = localStorage.getItem("uid");

  const handleStartDateInput = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && endDate < newStartDate) {
      setEndDate("");
      window.alert("起始日期不可晚於結束日期");
    }
  };

  const handleEndDateInput = (e) => {
    if (!startDate) {
      window.alert("請先設定起始日期");
      return;
    }
    const newEndDate = e.target.value;
    if (startDate && newEndDate < startDate) {
      window.alert("結束日期不可早於開始日期");
      return;
    }
    setEndDate(newEndDate);
  };

  useEffect(() => {
    const getTrip = async () => {
      const docRef = doc(database, "users", uid, "trips", currentLoadingTrip);
      const docSnap = await getDoc(docRef);
      setCurrentTrip(docSnap.data());
    };

    if (currentLoadingTrip && database) {
      getTrip();
    }
  }, [currentLoadingTrip]);

  return currentTrip ? (
    <>
      <div className="flex h-10 flex-row items-center justify-start ">
        <div className="flex h-full flex-row items-center rounded-l-lg border-2 border-solid border-sand px-3">
          <h1 className="whitespace-nowrap text-base font-bold text-slate-800">
            {currentTrip.name}
          </h1>
        </div>
        <div className="flex h-full flex-row items-center border-b-2 border-r-2 border-t-2 border-solid border-sand px-3">
          <h1 className="whitespace-nowrap text-base font-bold text-slate-800">
            起始日期：
          </h1>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateInput(e)}
          />
          {/* <input
            type="number"
            className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
          />
          <h1 className="whitespace-nowrap text-sm text-slate-800">月</h1>
          <input
            type="number"
            className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
          />
          <h1 className="whitespace-nowrap text-sm text-slate-800">日</h1> */}
        </div>
        <div className="flex h-full flex-row items-center border-b-2 border-r-2 border-t-2 border-solid border-sand px-3">
          <h1 className="whitespace-nowrap text-base font-bold text-slate-800">
            結束日期：
          </h1>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateInput(e)}
          />
          {/* <input
            type="number"
            className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
          />
          <h1 className="whitespace-nowrap text-sm text-slate-800">月</h1>
          <input
            type="number"
            className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
          />
          <h1 className="whitespace-nowrap text-sm text-slate-800">日</h1> */}
        </div>
        <div className="flex h-full flex-row items-center rounded-r-lg border-y-2 border-r-2 border-solid border-sand">
          <button className="h-full w-full whitespace-nowrap bg-sand px-4 font-bold">
            預覽行程
          </button>
        </div>
        <button
          className="ml-2 mt-5 cursor-pointer text-[10px] text-gray-500 underline decoration-gray-500 decoration-solid"
          onClick={() => tripSelectModal.current.showModal()}
        >
          重新選擇行程
        </button>
      </div>
    </>
  ) : (
    <span className="loading loading-bars loading-md"></span>
  );
};

export default Header;
