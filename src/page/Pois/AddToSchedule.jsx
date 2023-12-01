import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import useStore from "../../store/store";

const AddToSchedule = () => {
  const modalRef = useRef();
  const { database } = useStore();
  const uid = localStorage.getItem("uid");
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (database) {
      const colRef = collection(database, "users", uid, "trips");
      const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const currentTrips = [];
        querySnapshot.forEach((doc) => {
          currentTrips.push({ id: doc.id, data: doc.data() });
        });
        setTrips(currentTrips);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [database]);

  return (
    <>
      <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
        <button
          className="btn h-10 w-full rounded-xl bg-rose-200 p-2 font-bold text-gray-800 outline-none"
          onClick={() => modalRef.current.showModal()}
        >
          加入行程！
        </button>
        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <div className="flex flex-col items-start justify-start gap-4">
              <h3 className="text-xl font-bold">
                為景點寫上備註與消費並加入行程！
              </h3>
              <div className="flex flex-row items-center justify-start gap-2">
                <h4 className="whitespace-nowrap text-sm font-bold">
                  預估消費：
                </h4>
                <input
                  type="number"
                  placeholder=""
                  className="input input-sm input-bordered w-full max-w-xs"
                />
                <h4 className="whitespace-nowrap text-sm">元</h4>
              </div>
              <h4 className="whitespace-nowrap text-sm font-bold">
                景點備註：
              </h4>
              <textarea
                placeholder="「博濂推薦的，必吃！」、「月底有特別活動，去的時候要留意」......"
                className="textarea textarea-bordered textarea-md -mt-2 w-full"
              ></textarea>
              <h4 className="mt-8 whitespace-nowrap text-base font-bold">
                想把此景點加入哪個行程呢？
              </h4>
              <div className="-mt-2 flex w-full flex-row items-center justify-start gap-2">
                <select
                  className="select select-sm select-primary select-bordered w-1/3 shrink-0 "
                  defaultValue="disabled"
                >
                  <option disabled value="disabled">
                    選擇行程
                  </option>
                  {trips.map((trip, index) => {
                    return (
                      <option key={index} value={trip.data.name}>
                        {trip.data.name}
                      </option>
                    );
                  })}
                </select>

                <h1 className="whitespace-nowrap text-base">或新增行程：</h1>
                <input
                  type="text"
                  placeholder=""
                  className="input input-xs input-bordered w-full max-w-xs"
                />
                <button className="btn btn-circle btn-xs border-green-500 bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="stroke-green-500"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M256 112v288M400 256H112"
                    />
                  </svg>
                </button>
              </div>
              <form method="dialog" className="w-full">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <button className="btn btn-block btn-secondary text-lg text-gray-800">
                  放入行程！
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default AddToSchedule;
