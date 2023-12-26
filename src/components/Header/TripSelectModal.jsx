import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { forwardRef, useEffect, useState } from "react";
import globalStore, { scheduleStore } from "../../store/store";
import { PlusIcon } from "../../utils/icons";

const TripSelectModal = forwardRef((_, ref) => {
  const [selectedTrip, setSelectedTrip] = useState("disabled");
  const [tripsOption, setTripsOption] = useState([]);
  const [tripIdToLoad, setTripIdToLoad] = useState("");
  const [newTripToAdd, setNewTripToAdd] = useState("");
  const [newTripError, setNewTripError] = useState("");
  const { setCurrentLoadingTripId } = scheduleStore();

  const getDisplayLength = (str) => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      const charUnicode = str.charCodeAt(i);

      if (charUnicode >= 0x4e00 && charUnicode <= 0x9fff) {
        length += 2;
      } else {
        length += 1;
      }
    }
    return length;
  };

  const handleTripSelected = (e) => {
    setSelectedTrip(e.target.value);
    const correctOption = tripsOption.find(
      (option) => option.data.name === e.target.value,
    );
    if (correctOption) {
      setTripIdToLoad(correctOption.id);
    }
  };

  const handleNewTripInput = (e) => {
    const value = e.target.value;
    setNewTripToAdd(value);
    if (getDisplayLength(value) > 30) {
      setNewTripError("行程名稱最多15個字唷");
    } else {
      setNewTripError("");
    }
  };

  const { database } = globalStore();
  const uid = localStorage.getItem("uid");

  const handleAddNewBlankTrip = async () => {
    if (newTripToAdd.trim() === "") {
      setNewTripError("請填寫行程名稱");
      return;
    } else if (getDisplayLength(newTripToAdd) > 30) {
      setNewTripError("行程名稱最多15個字唷");
      return;
    } else {
      setNewTripError("");
    }
    const colRef = collection(database, "users", uid, "trips");
    const docRef = doc(colRef);

    await setDoc(docRef, {
      name: newTripToAdd,
    });

    setSelectedTrip(newTripToAdd);
    setTripIdToLoad(docRef.id);
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
              onClick={() => {
                setCurrentLoadingTripId(tripIdToLoad);
              }}
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
