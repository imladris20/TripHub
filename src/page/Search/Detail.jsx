import useStore from "../../store/store";
import { CloseIcon } from "../../utils/icons";

const Detail = () => {
  const { detailInfo, setDetailInfo } = useStore();

  console.log(detailInfo);

  const {
    place_id,
    name,
    formatted_phone_number,
    formatted_address,
    opening_hours: { weekday_text },
    photos,
    price_level,
    rating,
    types,
    user_ratings_total,
    geometry,
    address_components,
  } = detailInfo.data;

  const photoUrl = photos[Math.floor(Math.random() * 10)].getUrl();

  console.log(types);
  console.log(address_components[4].long_name);

  return (
    <div className="absolute left-[21%] top-8 z-[999] flex h-[calc(100%-32px)] w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-white p-3 shadow-2xl">
      <div className="flex w-[88%] flex-row items-center justify-start gap-2">
        <div className="flex h-5 w-5 flex-shrink-0 flex-row items-center justify-center rounded-full border border-dotted border-red-500 p-0 ">
          <h1 className="text-sm text-red-500">{detailInfo.label}</h1>
        </div>
        <h1 className="text-left text-lg font-bold">{name}</h1>
      </div>
      <a href={photoUrl} target="_blank">
        <img src={photoUrl} className="aspect-video w-full object-cover"></img>
      </a>
      <button
        className="absolute right-3 top-3 h-7 w-7"
        onClick={() => setDetailInfo(null)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="stroke-slate-600 stroke-2"
        >
          <CloseIcon />
        </svg>
      </button>
      <div className="flex h-[45%] w-full flex-col items-start justify-start gap-3 overflow-y-auto">
        <div className="flex flex-row items-center justify-start">
          <h2 className="text-xs">
            {rating} ⭐ ({user_ratings_total} 則)　｜
          </h2>
          <h2 className="text-xs">
            {formatted_phone_number
              ? `　☎️ ${formatted_phone_number}`
              : "店家未提供連絡電話"}
          </h2>
        </div>
        <h2 className="text-xs">
          {(() => {
            switch (price_level) {
              case 1:
                return "💰 花費參考： 200元以下 / 人";
              case 2:
                return "💰💰 花費參考： 200~400元 / 人";
              case 3:
                return "💰💰💰 花費參考： 400~800元 / 人";
              case 4:
                return "💰💰💰💰 花費參考： 800~1600元 / 人";
              default:
                return "";
            }
          })()}
        </h2>
        <h2 className="text-xs">🗺️ {formatted_address}</h2>
        {weekday_text ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs">⏲️ 營業時間</h3>
            <div className="ml-5 flex flex-col gap-[2px]">
              {weekday_text.map((day, index) => {
                return (
                  <h3
                    className="text-[10px]"
                    key={`weekday_${place_id}_${index}`}
                  >
                    {day}
                  </h3>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[1px]">
            <h3 className="text-[10px]">🤔 店家未提供詳細營業資訊</h3>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1>為景點加上屬於自己的標籤吧！</h1>
      </div>
    </div>
  );
};

export default Detail;
