import { yupResolver } from "@hookform/resolvers/yup";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import useStore, { poisStore } from "../../store/store";
import { PlusIcon } from "../../utils/icons";

const AddToSchedule = () => {
  const modalRef = useRef();
  const { database } = useStore();
  const { poisItemDetailInfo } = poisStore();
  const uid = localStorage.getItem("uid");
  const colRef = collection(database, "users", uid, "trips");

  const [tripsOption, setTripsOption] = useState([]);
  const [isPoisInSelectedTrip, setIsPoisInSelectedTrip] = useState(false);

  const [newTripToAdd, setNewTripToAdd] = useState("");
  const [newTripError, setNewTripError] = useState("");

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

  const validation = yup.object({
    expense: yup
      .number()
      .integer("僅能輸入整數")
      .typeError("請輸入有效數字")
      .min(0, "金額不可小於零")
      .max(9999, "金額不可超過9999元"),
    note: yup.string().max(150, "備註最多150字唷"),
    selectedTrip: yup.string().notOneOf(["disabled", "請選擇行程"]),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validation) });

  const handleNewTripInput = (e) => {
    const value = e.target.value;
    setNewTripToAdd(value);
    if (getDisplayLength(value) > 30) {
      setNewTripError("行程名稱最多15個字唷");
    } else {
      setNewTripError("");
    }
  };

  const handleAddNewBlankTrip = async () => {
    if (newTripToAdd.trim().length === 0) {
      setNewTripError("請填寫行程名稱");
      return;
    } else if (getDisplayLength(newTripToAdd) > 30) {
      setNewTripError("行程名稱最多15個字唷");
      return;
    } else {
      setNewTripError("");
    }

    if (find(tripsOption, (trip) => trip.data.name === newTripToAdd.trim())) {
      toast.error("此行程名稱已存在", {
        duration: 2000,
        className: "bg-slate-100 z-[999]",
        icon: "😅",
      });
      return;
    }

    await addDoc(colRef, {
      name: newTripToAdd,
    });

    setValue("selectedTrip", newTripToAdd);

    setNewTripToAdd("");
  };

  const findIdByName = (inputName, dataArray) => {
    const foundElement = dataArray.find((item) => item.data.name === inputName);
    return foundElement ? foundElement.id : null;
  };

  const handleAddPoisToTrip = async (values) => {
    const { selectedTrip, note, expense } = values;
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
    reset({
      expense: 0,
      note: "",
      selectedTrip: "disabled",
    });
    modalRef.current.close();
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
    const selectedTrip = watch("selectedTrip");
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
  }, [watch("selectedTrip")]);

  return (
    <div className="flex w-full flex-row items-center justify-center shadow-2xl">
      <button
        className="btn btn-secondary h-10 w-full rounded-xl p-2 font-bold text-gray-800 outline-none"
        onClick={() => modalRef.current.showModal()}
      >
        加入行程！
      </button>
      <dialog ref={modalRef} className="modal z-[998]">
        <div className="modal-box">
          <form
            className="flex flex-col items-start justify-start gap-4"
            onSubmit={handleSubmit(handleAddPoisToTrip)}
          >
            <h3 className="text-xl font-bold">
              為景點寫上備註與消費並加入行程！
            </h3>
            <div className="relative flex flex-row items-center justify-start gap-2">
              <h4 className="whitespace-nowrap text-sm font-bold">
                預估消費：
              </h4>
              <input
                type="number"
                defaultValue={0}
                min={0}
                placeholder="請填入金額"
                {...register("expense")}
                className="input input-bordered input-sm w-44 max-w-xs"
              />
              <h4 className="whitespace-nowrap text-sm">元</h4>
              {errors?.expense && (
                <h4 className="absolute bottom-[-24px] right-0 mt-2 text-right text-xs text-rose-900">
                  {errors.expense.message}
                </h4>
              )}
            </div>
            <h4 className="whitespace-nowrap text-sm font-bold">景點備註：</h4>
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="relative w-full">
                  <textarea
                    placeholder="「博濂推薦的，必吃！」、「老闆常放鳥沒開店，要先打電話」...等"
                    className="textarea textarea-bordered textarea-md -mt-2 w-full"
                    {...field}
                  />
                  {errors?.note && (
                    <h4 className="absolute bottom-[-24px] right-0 mt-2 text-right text-xs text-rose-900">
                      {errors.note.message}
                    </h4>
                  )}
                </div>
              )}
            />
            <h4 className="mt-8 whitespace-nowrap text-base font-bold">
              想把此景點加入哪個行程呢？
            </h4>
            <div className="relative -mt-2 flex w-full flex-row items-center justify-start gap-2">
              <Controller
                name="selectedTrip"
                control={control}
                defaultValue="disabled"
                render={({ field }) => (
                  <select
                    {...field}
                    className="select select-bordered select-primary select-sm w-1/3 shrink-0"
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
                )}
              />
              {errors?.selectedTrip && (
                <h4 className="mt-2 text-right text-xs text-rose-900">
                  {errors.selectedTrip.message}
                </h4>
              )}
              <h1 className="whitespace-nowrap text-base">或新增行程：</h1>
              <input
                type="text"
                placeholder=""
                className="input input-bordered input-xs w-full max-w-xs"
                value={newTripToAdd}
                onInput={(e) => handleNewTripInput(e)}
              />
              <button
                type="button"
                className="btn btn-circle btn-xs h-4 min-h-0 w-4 border-green-500 bg-white p-0"
                onClick={handleAddNewBlankTrip}
                disabled={!newTripToAdd}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="stroke-green-500"
                >
                  <PlusIcon />
                </svg>
              </button>
              {newTripError && (
                <h4 className="absolute bottom-[-24px] right-0 mt-2 text-right text-xs text-rose-900">
                  {newTripError}
                </h4>
              )}
            </div>
            {watch("selectedTrip") === "disabled" ? (
              <button
                className="btn mt-4 w-full cursor-not-allowed disabled:cursor-not-allowed"
                disabled
              >
                尚未選擇行程
              </button>
            ) : !isPoisInSelectedTrip ? (
              <button
                className="btn btn-secondary btn-block mt-4 text-lg text-gray-800"
                type="submit"
              >
                放入行程！
              </button>
            ) : (
              <button
                className="btn mt-4 w-full cursor-not-allowed disabled:cursor-not-allowed"
                disabled
              >
                此景點已經加入所選行程
              </button>
            )}
          </form>
          <form method="dialog" className="w-full">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={() => {
                reset({
                  expense: 0,
                  note: "",
                  selectedTrip: "disabled",
                });
              }}
            >
              ✕
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <Toaster />
      </dialog>
    </div>
  );
};

export default AddToSchedule;
