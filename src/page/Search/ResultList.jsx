import useStore from "../../store/store";
import { AddToPoisIcon } from "../../utils/icons";

const ResultList = () => {
  const { placeResult } = useStore();
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;

  console.log("result list components rendered");

  return (
    <div className="justify-start-start flex h-full w-full flex-col overflow-auto">
      {placeResult.map((place) => {
        return (
          <div
            key={place.place_id}
            className="relative flex w-full flex-col items-start gap-[6px] border-b-2 border-solid border-gray-200 bg-white p-2"
          >
            <button>
              <h1 className="mb-0 text-left text-lg font-bold">{place.name}</h1>
            </button>
            <h2 className="text-xs">
              {place.rating} ⭐ ({place.user_ratings_total}則)
            </h2>
            <h2 className="text-xs">{place.formatted_address}</h2>
            <div className="flex h-auto w-full flex-row items-center justify-start gap-3">
              <h2 className="text-xs text-green-800">營業中</h2>
              <h2 className="text-xs">|</h2>
              <h2 className="text-xs">03 358 8900</h2>
            </div>
            {place?.opening_hours?.weekday_text ? (
              <div className="flex flex-col gap-[1px]">
                {place.opening_hours.weekday_text.map((day) => {
                  return (
                    <h3
                      className="text-[10px]"
                      key={`weekday_${place.place_id}_${index}`}
                    >
                      {day}
                    </h3>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-[1px]">
                <h3 className="text-[10px]">🤔 店家未提供詳細營業時間</h3>
              </div>
            )}
            <h2 className="text-xs">
              {(() => {
                switch (place.price_level) {
                  case 1:
                    return "💰 200元以下 / 人";
                  case 2:
                    return "💰💰 200~400元 / 人";
                  case 3:
                    return "💰💰💰 400~800元 / 人";
                  case 4:
                    return "💰💰💰💰 800~1600元 / 人";
                  default:
                    return "🤔 店家未提供價位參考";
                }
              })()}
            </h2>
            {/* <h3>{labels[labelIndex++ % labels.length]}</h3> */}
            <button className="absolute bottom-2 right-2 h-8 w-8">
              <AddToPoisIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResultList;
