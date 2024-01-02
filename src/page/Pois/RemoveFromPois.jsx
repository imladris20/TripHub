import { useRef } from "react";
import { poisStore } from "../../store/store";
import { db } from "../../utils/tripHubDb";

const RemoveFromPois = () => {
  const { poisItemDetailInfo, setPoisItemDetailInfo } = poisStore();

  const removeRef = useRef();

  const handleDeleteClick = async () => {
    const newDocData = { archived: true };
    await db.updateDoc("removeFromPois", newDocData);
    setPoisItemDetailInfo(null);
  };

  return (
    <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
      <button
        className="btn h-10 w-full rounded-xl bg-sand p-2 font-bold text-gray-800 outline-none"
        onClick={() => removeRef.current.showModal()}
      >
        移出口袋清單
      </button>
      <dialog ref={removeRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            確定要把「{poisItemDetailInfo.data.name}」移出口袋清單嗎？
          </h3>
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn mr-2 h-9 min-h-0">再想想</button>
              <button
                className="btn h-9 min-h-0 bg-sand"
                onClick={() => handleDeleteClick()}
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

export default RemoveFromPois;
