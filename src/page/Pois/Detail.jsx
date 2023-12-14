import axios from "axios";
import { useEffect, useState } from "react";
import PlaceHolderPhoto from "../../assets/pois_photo_placeholder.png";
import useStore, { poisStore } from "../../store/store";
import { CloseIcon } from "../../utils/icons";
import AddToSchedule from "./AddToSchedule";

const Detail = () => {
  const { poisItemDetailInfo, setPoisItemDetailInfo } = poisStore();
  const { apiKey } = useStore();

  const {
    id,
    data: {
      name,
      phoneNumber,
      address,
      openingHours,
      priceLevel,
      rating,
      ratingTotal,
      location,
      gmapUrl,
    },
  } = poisItemDetailInfo;

  const [photoLink, setPhotoLink] = useState();

  useEffect(() => {
    const getValidPhoto = async (id) => {
      const detailApi = `https://places.googleapis.com/v1/places/${id}?fields=id,photos&key=${apiKey}`;

      const response = await axios.get(detailApi);

      if (response.data.photos) {
        const photoName = response.data?.photos[0].name;
        const photoApi = `https://places.googleapis.com/v1/${photoName}/media?skipHttpRedirect=true&maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;

        const result = await axios.get(photoApi);
        setPhotoLink(result.data.photoUri);
      }
    };
    getValidPhoto(id);
  }, [id]);

  return (
    <div className="absolute left-[26%] z-[997] flex h-full w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-white p-3 shadow-2xl 2xl:w-1/5">
      <div className="flex w-[88%] flex-row items-center justify-start gap-2">
        {gmapUrl ? (
          <a
            className="link text-left text-base font-bold"
            href={gmapUrl}
            target="_blank"
          >
            {name}
          </a>
        ) : (
          <h1 className="text-left text-base font-bold">{name}</h1>
        )}
      </div>
      {photoLink && photoLink !== "店家未提供" ? (
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
      <AddToSchedule />
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
  );
};

export default Detail;
