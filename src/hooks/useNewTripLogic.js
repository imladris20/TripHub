import { useState } from "react";
import { db } from "../utils/tripHubDb";
import { getDisplayLength } from "../utils/util";

const useNewTripLogic = () => {
  const [newTripError, setNewTripError] = useState("");
  const [newTripToAdd, setNewTripToAdd] = useState("");

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

    const newdocId = await db.setNewDoc("trips", { name: newTripToAdd });
    setSelectedTrip(newTripToAdd);
    setTripIdToLoad(newdocId);
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
