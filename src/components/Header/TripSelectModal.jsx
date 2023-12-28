import { collection, onSnapshot } from "firebase/firestore";
import { forwardRef, useEffect, useState } from "react";
import globalStore, { scheduleStore } from "../../store/store";
import { PlusIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb";
import { getDisplayLength } from "../../utils/util";

const TripSelectModal = forwardRef((_, ref) => {
  const [selectedTrip, setSelectedTrip] = useState("disabled");
  const [tripsOption, setTripsOption] = useState([]);
  const [tripIdToLoad, setTripIdToLoad] = useState("");
  const [newTripToAdd, setNewTripToAdd] = useState("");
  const [newTripError, setNewTripError] = useState("");
  const { setCurrentLoadingTripId } = scheduleStore();
  const { database, uid } = globalStore();

  const handleTripSelected = (e) => {
    setSelectedTrip(e.target.value);
    const correctOption = tripsOption.find(
      (option) => option.data.name === e.target.value,
    );
    if (correctOption) {
      setTripIdToLoad(correctOption.id);
    }
  };

  const checkOverflow = (str) => {
    if (getDisplayLength(str) > 30) {
      setNewTripError("行程名稱最多15個字唷");
      return true;
    }
    setNewTripError("");
  };

  const handleNewTripInput = (e) => {
    const value = e.target.value;
    setNewTripToAdd(value);
    checkOverflow(value);
  };

  const handleAddNewBlankTrip = async () => {
    if (newTripToAdd.trim() === "") {
      setNewTripError("請填寫行程名稱");
      return;
    }

    if (checkOverflow(newTripToAdd)) return;

    const newdocId = await db.setNewDoc("trips", { name: newTripToAdd });
    setSelectedTrip(newTripToAdd);
    setTripIdToLoad(newdocId);
    setNewTripToAdd("");
  };

  //  open modal first while page loaded
  useEffect(() => {
    if (ref?.current) {
      ref?.current?.showModal();
    }
  }, []);

  //  Load trip options on firestore into selections
  useEffect(() => {
    if (!database) return;

    const colRef = collection(database, "users", uid, "trips");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const currentTrips = [];
      querySnapshot.forEach((doc) => {
        currentTrips.push({ id: doc.id, data: doc.data() });
      });
      setTripsOption(currentTrips);
    });

    return () => {
      unsubscribe();
    };
  }, [database]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box flex flex-col items-center justify-start gap-4">
        <h3 className="text-xl font-bold">請選擇行程</h3>
        <select
          className="select select-primary w-full shrink-0"
          value={selectedTrip}
          onChange={(e) => handleTripSelected(e)}
        >
          <option disabled value="disabled">
            選擇行程
          </option>
          {tripsOption.map((trip, index) => {
            return (
              <option key={index} value={trip.data.name}>
                {trip.data.name}
              </option>
            );
          })}
        </select>
        <div className="relative flex w-full flex-row items-center justify-start gap-2">
          <form method="dialog">
            <button
              className="btn btn-secondary w-36 whitespace-nowrap text-gray-800"
              onClick={() => setCurrentLoadingTripId(tripIdToLoad)}
            >
              確認選擇
            </button>
          </form>
          <h1 className="whitespace-nowrap text-base">或新增行程：</h1>
          <input
            type="text"
            placeholder=""
            className="input input-bordered input-xs w-full max-w-xs"
            value={newTripToAdd}
            onInput={(e) => handleNewTripInput(e)}
          />
          <button
            className="btn btn-circle btn-xs h-4 min-h-0 w-4 border-green-500 bg-white p-0"
            onClick={handleAddNewBlankTrip}
            disabled={!newTripToAdd}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={`${
                !newTripToAdd ? "stroke-slate-400" : "stroke-green-500"
              }`}
            >
              <PlusIcon />
            </svg>
          </button>
          {newTripError && (
            <h4 className="absolute bottom-[-12px] right-0 mt-2 text-right text-xs text-rose-900">
              {newTripError}
            </h4>
          )}
        </div>
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          onClick={() => ref.current.close()}
        >
          ✕
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

export default TripSelectModal;
