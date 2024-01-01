import { find } from "lodash";
import { useState } from "react";
import toast from "react-hot-toast";
import globalStore from "../store/store";
import { db } from "../utils/tripHubDb";
import { getDisplayLength } from "../utils/util";

const useNewTripLogic = () => {
  const [newTripError, setNewTripError] = useState("");
  const [newTripToAdd, setNewTripToAdd] = useState("");

  const { tripsOption } = globalStore();

  const checkOverflow = (str) => {
    if (getDisplayLength(str) > 30) {
      setNewTripError("行程名稱最多15個字唷");
      return true;
    }
    setNewTripError("");
  };

  const handleNewTripInput = (e) => {
    const newTripName = e.target.value;
    setNewTripToAdd(newTripName);
    checkOverflow(newTripName);
  };

  const handleAddNewBlankTrip = async (setSelectedTrip, setTripIdToLoad) => {
    if (newTripToAdd.trim() === "") {
      setNewTripError("請填寫行程名稱");
      return;
    }

    if (checkOverflow(newTripToAdd)) return;

    if (find(tripsOption, (trip) => trip.data.name === newTripToAdd.trim())) {
      toast.error("此行程名稱已存在", {
        duration: 2000,
        className: "bg-slate-100 z-[999]",
        icon: "😅",
      });
      return;
    }

    const newdocId = await db.setNewDoc("trips", { name: newTripToAdd });
    setSelectedTrip(newTripToAdd);
    if (setTripIdToLoad) {
      setTripIdToLoad(newdocId);
    }
    setNewTripToAdd("");
  };

  return {
    newTripToAdd,
    newTripError,
    handleNewTripInput,
    handleAddNewBlankTrip,
  };
};

export default useNewTripLogic;
