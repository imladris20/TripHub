import { deleteDoc, doc } from "firebase/firestore";
import { useRef } from "react";
import useStore, { poisStore } from "../../store/store";

const RemoveFromPois = () => {
  const { database } = useStore();
  const { poisItemDetailInfo, setPoisItemDetailInfo } = poisStore();
  const uid = localStorage.getItem("uid");

  const removeRef = useRef();

  const handleDeleteClick = async () => {
    await deleteDoc(
      doc(database, "users", uid, "pointOfInterests", poisItemDetailInfo.id),
    );
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
          <p className="py-4">
            若確定移出，此地點將會同步從所有已加入的行程中移除。
          </p>
          <div className="modal-action mt-4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
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
