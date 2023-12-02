import PlaceHolderPhoto from "../../assets/pois_photo_placeholder.png";
import { scheduleStore } from "../../store/store";
import { CloseIcon } from "../../utils/icons";

const Detail = () => {
  const { attractionItemDetail, setAttractionItemDetail } = scheduleStore();

  const {
    address,
    categories,
    city,
    location,
    name,
    openingHours,
    phoneNumber,
    photoLink,
    priceLevel,
    rating,
    ratingTotal,
    note,
    expense,
  } = attractionItemDetail;

  console.log(note);
  console.log(expense);

  return (
    <div className="absolute left-[21%] z-[997] flex h-full w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-gray-100 p-3 shadow-2xl 2xl:w-1/5">
      <div className="flex w-[88%] flex-row items-center justify-start gap-2">
        <h1 className="text-left text-base font-bold">{name}</h1>
      </div>
      {photoLink ? (
        <a href={photoLink} target="_blank">
          <img src={photoLink} className="aspect-video w-full object-cover" />
        </a>
      ) : (
        <img
          src={PlaceHolderPhoto}
          className="aspect-video w-full object-cover"
        />
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
                  <h3 className="text-[11px]" key={`weekday_${index}`}>
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
      <div className="mt-4">
        <h1 className="text-sm font-bold">預計消費：{expense}元 💸</h1>
      </div>
      <div>
        <h1 className="text-sm font-bold">備註：</h1>
        <h2 className="text-xs">{note}</h2>
      </div>
      <button
        className="absolute right-3 top-3 h-7 w-7"
        onClick={() => setAttractionItemDetail(null)}
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
  );
};

export default Detail;
