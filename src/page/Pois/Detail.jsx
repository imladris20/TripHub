import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import PlaceHolderPhoto from "../../assets/pois_photo_placeholder.png";
import useStore, { poisStore } from "../../store/store";
import { CloseIcon } from "../../utils/icons";

const Detail = () => {
  const { typeOptions, database } = useStore();
  const { poisItemDetailInfo, setPoisItemDetailInfo } = poisStore();
  const uid = localStorage.getItem("uid");
  const modalRef = useRef();
  const [trips, setTrips] = useState([]);

  // const setDocMutation = useMutation(({ database, uid, place_id, docData }) => {
  //   setDoc(doc(database, `users/${uid}/pointOfInterests`, place_id), docData, {
  //     merge: true,
  //   });
  // });

  useEffect(() => {
    if (database) {
      const colRef = collection(database, "users", uid, "trips");
      const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const currentTrips = [];
        querySnapshot.forEach((doc) => {
          currentTrips.push({ tripId: doc.id, tripData: doc.data() });
        });
        setTrips(currentTrips);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [database]);

  console.log(trips);

  const {
    place_id: id,
    data: {
      name,
      phoneNumber,
      address,
      openingHours,
      photoLink,
      priceLevel,
      rating,
      ratingTotal,
      location,
    },
  } = poisItemDetailInfo;

  return (
    <>
      <div className="absolute left-[21%] z-[997] flex h-full w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-white p-3 shadow-2xl 2xl:w-1/5">
        <div className="flex w-[88%] flex-row items-center justify-start gap-2">
          <h1 className="text-left text-base font-bold">{name}</h1>
        </div>
        {photoLink ? (
          <a href={photoLink} target="_blank">
            <img
              src={photoLink}
              className="aspect-video w-full object-cover"
            ></img>
          </a>
        ) : (
          <img
            src={PlaceHolderPhoto}
            className="aspect-video w-full object-cover"
          ></img>
        )}
        <div className="flex w-full flex-col items-start justify-start gap-3 overflow-y-auto">
          <div className="flex flex-row items-center justify-start">
            <h2 className="text-xs">
              {rating} ⭐ ({ratingTotal} 則)　｜
            </h2>
            <h2 className="text-xs">
              {phoneNumber ? `　☎️ ${phoneNumber}` : "😅 店家未提供連絡電話"}
            </h2>
          </div>
          <h2 className="text-xs">
            {(() => {
              switch (priceLevel) {
                case 1:
                  return "💰 花費參考： 200元以下 / 人";
                case 2:
                  return "💰💰 花費參考： 200~400元 / 人";
                case 3:
                  return "💰💰💰 花費參考： 400~800元 / 人";
                case 4:
                  return "💰💰💰💰 花費參考： 800~1600元 / 人";
                default:
                  return "😅 店家未提供價位參考";
              }
            })()}
          </h2>
          <h2 className="text-xs">🗺️ {address}</h2>
          {openingHours !== "店家未提供" ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs">⏲️ 營業時間</h3>
              <div className="ml-5 flex flex-col gap-[2px]">
                {openingHours.map((day, index) => {
                  return (
                    <h3 className="text-[11px]" key={`weekday_${id}_${index}`}>
                      {day}
                    </h3>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-[1px]">
              <h3 className="text-xs">😅 店家未提供詳細營業資訊</h3>
            </div>
          )}
        </div>
        <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
          <button
            className="btn h-10 w-full rounded-xl bg-rose-200 p-2 font-bold text-gray-800 outline-none"
            onClick={() => modalRef.current.showModal()}
          >
            加入行程！
          </button>
          <dialog ref={modalRef} className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
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
                        <option key={index} value={trip.tripData.name}>
                          {trip.tripData.name}
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
                <button className="btn btn-block btn-secondary text-lg text-gray-800">
                  放入行程！
                </button>
              </div>
            </div>
          </dialog>
        </div>
        <button
          className="absolute right-3 top-3 h-7 w-7"
          onClick={() => setPoisItemDetailInfo(null)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="stroke-slate-600 stroke-2"
          >
            <CloseIcon />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Detail;
