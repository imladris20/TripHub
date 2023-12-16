import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import useStore, { poisStore } from "../../store/store";
import { PlusIcon } from "../../utils/icons";

const AddToSchedule = () => {
  const modalRef = useRef();
  const { database } = useStore();
  const { poisItemDetailInfo } = poisStore();
  const uid = localStorage.getItem("uid");
  const colRef = collection(database, "users", uid, "trips");

  const [tripsOption, setTripsOption] = useState([]);
  const [expense, setExpense] = useState("");
  const [note, setNote] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("disabled");
  const [newTripToAdd, setNewTripToAdd] = useState("");
  const [isPoisInSelectedTrip, setIsPoisInSelectedTrip] = useState(false);

  const handlePriceChange = (e) => {
    setExpense(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTripSelected = (e) => {
    setSelectedTrip(e.target.value);
  };

  const handleNewTripInput = (e) => {
    setNewTripToAdd(e.target.value);
  };

  const resetAllInput = () => {
    setExpense("");
    setNote("");
    setSelectedTrip("disabled");
    setNewTripToAdd("");
  };

  const handleAddNewBlankTrip = async () => {
    if (!newTripToAdd) {
      window.alert("請確實填寫行程名稱");
      return;
    }
    await addDoc(colRef, {
      name: newTripToAdd,
    });
    setNewTripToAdd("");
  };

  const findIdByName = (inputName, dataArray) => {
    const foundElement = dataArray.find((item) => item.data.name === inputName);
    return foundElement ? foundElement.id : null;
  };

  const handleAddPoisToTrip = async () => {
    const docId = findIdByName(selectedTrip, tripsOption);
    const docRef = doc(database, "users", uid, "trips", docId);
    const newData = {
      attractions: arrayUnion({
        note,
        expense,
        daySequence: 0,
        inDayOrder: 0,
        name: poisItemDetailInfo.data.name,
        poisId: poisItemDetailInfo.id,
      }),
    };
    await updateDoc(docRef, newData);
    resetAllInput();
  };

  useEffect(() => {
    if (database) {
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
    }
  }, [database]);

  useEffect(() => {
    const compare = async () => {
      const docId = findIdByName(selectedTrip, tripsOption);
      const docRef = doc(database, "users", uid, "trips", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const checkResult = docSnap.data()?.attractions?.some((attraction) => {
          return attraction.poisId === poisItemDetailInfo.id;
        });
        setIsPoisInSelectedTrip(checkResult);
      }
    };
    if (
      poisItemDetailInfo &&
      tripsOption.length !== 0 &&
      selectedTrip !== "disabled"
    ) {
      compare();
    }
  }, [selectedTrip]);

  return (
    <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
      <button
        className="btn btn-primary h-10 w-full rounded-xl p-2 font-bold text-gray-800 outline-none"
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
                placeholder="請填入數字"
                value={expense}
                onInput={(e) => handlePriceChange(e)}
                className="input input-bordered input-sm w-full max-w-xs"
              />
              <h4 className="whitespace-nowrap text-sm">元</h4>
            </div>
            <h4 className="whitespace-nowrap text-sm font-bold">景點備註：</h4>
            <textarea
              placeholder="「博濂推薦的，必吃！」、「老闆常放鳥沒開店，要先打電話」...等"
              className="textarea textarea-bordered textarea-md -mt-2 w-full"
              value={note}
              onInput={(e) => handleNoteChange(e)}
            ></textarea>
            <h4 className="mt-8 whitespace-nowrap text-base font-bold">
              想把此景點加入哪個行程呢？
            </h4>
            <div className="-mt-2 flex w-full flex-row items-center justify-start gap-2">
              <select
                className="select select-bordered select-primary select-sm w-1/3 shrink-0"
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

              <h1 className="whitespace-nowrap text-base">或新增行程：</h1>
              <input
                type="text"
                placeholder=""
                className="input input-bordered input-xs w-full max-w-xs"
                value={newTripToAdd}
                onInput={(e) => handleNewTripInput(e)}
              />
              <button
                className="btn btn-circle btn-xs border-green-500 bg-white"
                onClick={handleAddNewBlankTrip}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="stroke-green-500"
                >
                  <PlusIcon />
                </svg>
              </button>
            </div>
            <form method="dialog" className="w-full">
              <button
                className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                onClick={resetAllInput}
              >
                ✕
              </button>
              {selectedTrip === "disabled" ? (
                <button
                  className="btn w-full cursor-not-allowed disabled:cursor-not-allowed"
                  disabled
                >
                  尚未選擇行程
                </button>
              ) : !isPoisInSelectedTrip ? (
                <button
                  className="btn btn-secondary btn-block text-lg text-gray-800"
                  onClick={handleAddPoisToTrip}
                >
                  放入行程！
                </button>
              ) : (
                <button
                  className="btn w-full cursor-not-allowed disabled:cursor-not-allowed"
                  disabled
                >
                  此景點已經加入所選行程
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddToSchedule;
