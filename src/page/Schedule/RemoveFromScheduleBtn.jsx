import { filter } from "lodash";
import { useRef } from "react";
import { scheduleStore } from "../../store/store";
import { db } from "../../utils/tripHubDb";

const RemoveFromScheduleBtn = () => {
  const {
    attractionsData: allAttractions,
    attractionItemDetail,
    setAttractionItemDetail,
  } = scheduleStore();

  const removeRef = useRef();

  const handleRemoveClick = async () => {
    const newArractions = filter(
      allAttractions,
      (attraction) => attraction.poisId !== attractionItemDetail.poisId,
    );
    const newDocData = { attractions: newArractions };
    await db.updateDoc("currentTrip", newDocData);
    setAttractionItemDetail(null);
  };

  return (
    <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
      <button
        className="btn h-10 w-full rounded-xl bg-sand p-2 font-bold text-gray-800 outline-none"
        onClick={() => removeRef.current.showModal()}
      >
        移出行程
      </button>
      <dialog ref={removeRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            確定要把「{attractionItemDetail.name}」移出行程嗎？
          </h3>
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn mr-2 h-9 min-h-0">再想想</button>
              <button
                className="btn h-9 min-h-0 bg-sand"
                onClick={handleRemoveClick}
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
    </div>
  );
};

export default RemoveFromScheduleBtn;
