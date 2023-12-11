import { doc, setDoc } from "firebase/firestore";
import { produce } from "immer";
import { useState } from "react";
import { useMutation } from "react-query";
import PlaceHolderPhoto from "../../assets/pois_photo_placeholder.png";
import useStore from "../../store/store";
import { CloseIcon } from "../../utils/icons";

const Detail = () => {
  const {
    searchItemDetailInfo,
    setSearchItemDetailInfo,
    typeOptions,
    database,
  } = useStore();
  const uid = localStorage.getItem("uid");
  const [categoryTags, setCategoryTags] = useState(new Array(3).fill("請選擇"));

  const setDocMutation = useMutation(({ database, uid, place_id, docData }) => {
    setDoc(doc(database, `users/${uid}/pointOfInterests`, place_id), docData, {
      merge: true,
    });
  });

  const {
    place_id,
    name,
    formatted_phone_number,
    formatted_address,
    opening_hours,
    photos,
    price_level,
    rating,
    user_ratings_total,
    address_components,
    geometry,
    url,
  } = searchItemDetailInfo.data;

  const city = address_components.find((element) =>
    element.types.includes("administrative_area_level_1"),
  ).long_name;

  const handleAddToPoisBtnClicked = async () => {
    const docData = {
      name: name,
      location: {
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
      },
      address: formatted_address || "店家未提供",
      phoneNumber: formatted_phone_number || "店家未提供",
      rating: rating || "店家未提供",
      ratingTotal: user_ratings_total || "店家未提供",
      priceLevel: price_level || "店家未提供",
      city,
      categories: categoryTags.filter((value) => value !== "請選擇"),
      photoLink: photos[0].getUrl() || "店家未提供",
      openingHours: opening_hours?.weekday_text || "店家未提供",
    };

    await setDocMutation.mutateAsync({
      database,
      uid,
      place_id,
      docData,
    });
  };

  const handleSelectChange = (e, index) => {
    setCategoryTags(
      produce((state) => {
        state[index] = e.target.value;
      }),
    );
  };

  return (
    <div className="absolute left-[21%] top-8 z-[999] flex h-[calc(100%-32px)] w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-white p-3 shadow-2xl 2xl:w-1/5">
      <div className="flex w-[88%] flex-row items-center justify-start gap-2">
        <div className="flex h-4 w-4 flex-shrink-0 flex-row items-center justify-center rounded-full border border-dotted border-red-500 p-0 ">
          <h1 className="text-xs text-red-500">{searchItemDetailInfo.label}</h1>
        </div>
        <a
          href={url}
          target="_blank"
          className="link truncate text-left text-base font-bold"
        >
          {name}
        </a>
      </div>
      {photos ? (
        <a href={photos[0].getUrl()} target="_blank">
          <img
            src={photos[0].getUrl()}
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
            {rating} ⭐ ({user_ratings_total} 則)　｜
          </h2>
          <h2 className="text-xs">
            {formatted_phone_number
              ? `　☎️ ${formatted_phone_number}`
              : "😅 店家未提供連絡電話"}
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
                return "😅 店家未提供價位參考";
            }
          })()}
        </h2>
        <h2 className="text-xs">🗺️ {formatted_address}</h2>
        {opening_hours?.weekday_text ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs">⏲️ 營業時間</h3>
            <div className="ml-5 flex flex-col gap-[2px]">
              {opening_hours.weekday_text.map((day, index) => {
                return (
                  <h3
                    className="text-[11px]"
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
            <h3 className="text-xs">😅 店家未提供詳細營業資訊</h3>
          </div>
        )}
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h1 className="text-left text-base font-bold">
          為景點加上標籤再放入口袋清單吧~
        </h1>
        <div className="flex w-full flex-row items-center justify-start gap-4 px-[2px]">
          {[...Array(3)].map((_, index) => (
            <select
              key={index}
              className="h-7 w-[84px] cursor-pointer rounded-lg bg-lime-200 p-1 text-xs text-black shadow outline-none"
              value={categoryTags[index]}
              onChange={(e) => handleSelectChange(e, index)}
            >
              <option
                className="bg-white text-xs text-slate-800"
                value="請選擇"
              >
                請選擇
              </option>
              {typeOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.name}
                  className="bg-white text-xs text-slate-800"
                >
                  {option.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
      <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
        {setDocMutation.isSuccess ? (
          <button
            className="h-10 w-full cursor-default rounded-xl bg-sky-200 p-2 font-bold text-gray-800"
            onClick={() => handleAddToPoisBtnClicked()}
          >
            加入成功！
          </button>
        ) : (
          <button
            className="h-10 w-full rounded-xl bg-rose-200 p-2 font-bold text-gray-800"
            onClick={() => handleAddToPoisBtnClicked()}
          >
            加入口袋清單！
          </button>
        )}
      </div>
      <button
        className="absolute right-3 top-3 h-7 w-7"
        onClick={() => setSearchItemDetailInfo(null)}
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
