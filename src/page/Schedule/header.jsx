import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useStore, { scheduleStore } from "../../store/store";

const Header = () => {
  const [currentTrip, setCurrentTrip] = useState();
  const { database } = useStore();
  const { currentLoadingTrip } = scheduleStore();
  const uid = localStorage.getItem("uid");

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
    <div className="flex h-10 flex-row items-center justify-start ">
      <div className="border-sand flex h-full flex-row items-center rounded-l-lg border-2 border-solid px-3">
        <h1 className="text-base font-bold text-slate-800">
          {currentTrip.name}
        </h1>
      </div>
      <div className="border-sand flex h-full flex-row items-center border-b-2 border-r-2 border-t-2 border-solid px-3">
        <h1 className="whitespace-nowrap text-base font-bold text-slate-800">
          起始日期：
        </h1>
        <input
          type="number"
          className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
        />
        <h1 className="whitespace-nowrap text-sm text-slate-800">月</h1>
        <input
          type="number"
          className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
        />
        <h1 className="whitespace-nowrap text-sm text-slate-800">日</h1>
      </div>
      <div className="border-sand flex h-full flex-row items-center border-b-2 border-r-2 border-t-2 border-solid px-3">
        <h1 className="whitespace-nowrap text-base font-bold text-slate-800">
          結束日期：
        </h1>
        <input
          type="number"
          className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
        />
        <h1 className="whitespace-nowrap text-sm text-slate-800">月</h1>
        <input
          type="number"
          className="mr-1 w-12 rounded border border-solid border-slate-300 pl-2 outline-none"
        />
        <h1 className="whitespace-nowrap text-sm text-slate-800">日</h1>
      </div>
      <div className="border-sand flex h-full flex-row items-center rounded-r-lg border-y-2 border-r-2 border-solid">
        <button className="bg-sand h-full w-full px-4 font-bold">
          預覽行程
        </button>
      </div>
    </div>
  ) : (
    <span className="loading loading-bars loading-md"></span>
  );
};

export default Header;
