import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { find } from "lodash";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import TravelModeAlert from "./TravelModeAlert";

function addDurationToTime(startTime, duration) {
  const startTimeParts = startTime.split(":");
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);
  const startDate = new Date(0, 0, 0, startHours, startMinutes);

  startDate.setMinutes(startDate.getMinutes() + duration);

  const newHours = startDate.getHours();
  const newMinutes = startDate.getMinutes();

  const result = `${String(newHours).padStart(2, "0")}:${String(
    newMinutes,
  ).padStart(2, "0")}`;

  return result;
}

const TimeCard = ({
  trip,
  attraction,
  cardOrder,
  isLastOne,
  dayStartTime,
  wholeDay,
}) => {
  const { apiKey, database, typeOptions } = useStore();
  const uid = localStorage.getItem("uid");

  const initAttractionStartTime = () => {
    if (cardOrder === 1) {
      return dayStartTime;
    } else {
      let totalDuration = 0;
      for (let i = 0; i < cardOrder - 1; i++) {
        totalDuration += wholeDay[i].duration + wholeDay[i].routeDuration;
      }
      const result = addDurationToTime(dayStartTime, totalDuration);
      return result;
    }
  };

  const attractionStartTime = initAttractionStartTime();

  const initAttractionEndTime = () => {
    let totalDuration = 0;
    for (let i = 0; i < cardOrder; i++) {
      totalDuration += wholeDay[i].duration;
      if (cardOrder - 1 !== i) {
        totalDuration += wholeDay[i].routeDuration;
      }
    }
    const result = addDurationToTime(dayStartTime, totalDuration);
    return result;
  };

  const attractionEndTime = initAttractionEndTime();

  const [placeNewestDetail, setPlaceNewestDetail] = useState();

  const [placePhoto, setPlacePhoto] = useState();

  const [categories, setCategories] = useState([]);

  const calculateDurationText = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return (
      <h1 className="text-left text-sm">
        {hours}小時{minutes}分鐘
      </h1>
    );
  };

  useEffect(() => {
    const getPlaceDetails = async (placeId) => {
      const apiUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,photos,googleMapsUri,formattedAddress,formattedAddress,nationalPhoneNumber,priceLevel,rating,userRatingCount,websiteUri,regularOpeningHours,regularSecondaryOpeningHours&key=${apiKey}`;

      const result = await axios.get(apiUrl);
      return result.data;
    };

    const getPlacePhoto = async (photoName) => {
      const apiUrl = `https://places.googleapis.com/v1/${photoName}/media?skipHttpRedirect=true&maxHeightPx=1000&maxWidthPx=1000&key=${apiKey}`;
      const result = await axios(apiUrl);
      return result.data.photoUri;
    };

    const getCategory = async (poisId) => {
      const docRef = doc(database, "users", uid, "pointOfInterests", poisId);
      const docSnap = await getDoc(docRef);
      return docSnap.data().categories;
    };

    const init = async () => {
      const detail = await getPlaceDetails(attraction.poisId);
      setPlaceNewestDetail(detail);
      const photoUri = await getPlacePhoto(detail?.photos[0].name);
      setPlacePhoto(photoUri);
      const tags = await getCategory(attraction.poisId);
      setCategories(tags);
    };

    init();
  }, []);

  return (
    <>
      {/* attraction */}
      <li>
        {cardOrder !== 1 && <hr />}
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div
          className={
            cardOrder % 2 === 1 ? "timeline-start md:text-end" : "timeline-end"
          }
        >
          <time className="font-mono text-xl italic">
            {attractionStartTime}
          </time>
          <div className="card h-60 w-96 bg-base-100 shadow-xl">
            <figure className="rounded-xl">
              <img
                src={placePhoto}
                alt="attraction"
                className="h-60 w-96 object-cover"
              />
            </figure>
          </div>
        </div>
        <div
          className={
            cardOrder % 2 === 1 ? "timeline-end" : "timeline-start md:text-end"
          }
        >
          <time className="font-mono text-xl italic text-secondary">
            {attractionStartTime}
          </time>
          <div className="card h-60 w-96 bg-base-100 shadow-xl">
            <div className="card-body pb-6 pt-4">
              <div className="flex flex-row items-center gap-4">
                <a
                  href={placeNewestDetail?.googleMapsUri}
                  target="_blank"
                  className="link text-deyork"
                >
                  <h2 className="w-220px card-title max-w-[220px] truncate">
                    {placeNewestDetail?.displayName?.text}
                  </h2>
                </a>
                {placeNewestDetail?.regularOpeningHours?.openNow ? (
                  <div className="badge badge-secondary">營業中</div>
                ) : (
                  <div className="badge badge-warning">休息中</div>
                )}
              </div>
              <div className="flex flex-row items-center justify-start">
                <h2 className="text-xs">
                  {placeNewestDetail?.rating} ⭐ (
                  {placeNewestDetail?.userRatingCount} 則)
                </h2>
                {placeNewestDetail?.nationalPhoneNumber && (
                  <h2 className="ml-3 text-xs">
                    ｜　☎️ {placeNewestDetail?.nationalPhoneNumber}
                  </h2>
                )}
                <h2 className="ml-3 text-xs">|　</h2>
                {placeNewestDetail?.websiteUri && (
                  <a
                    className="text-xs text-sky-500 underline"
                    href={placeNewestDetail.websiteUri}
                  >
                    {" "}
                    官網
                  </a>
                )}
              </div>
              <h2 className="text-left text-xs">
                {placeNewestDetail?.formattedAddress}
              </h2>
              <div className="mt-2 flex flex-row items-start justify-start">
                <h1 className="whitespace-nowrap text-left text-sm font-bold">
                  備註：
                </h1>
                <h1 className="text-left text-sm">{attraction.note}</h1>
              </div>
              <div className="flex flex-row items-center justify-start">
                <h1 className="whitespace-nowrap text-left text-sm font-bold">
                  預計花費：
                </h1>
                <h1 className="text-left text-sm">
                  {attraction.expense || 0}元
                </h1>
              </div>
              <div className="flex flex-row items-center justify-start">
                <h1 className="whitespace-nowrap text-left text-sm font-bold">
                  預計停留時間：
                </h1>
                {calculateDurationText(attraction.duration)}
              </div>
              <div className="card-actions absolute bottom-4 right-4">
                {categories.map((item, index) => {
                  let bgColor;
                  let textColor;
                  bgColor = find(typeOptions, { name: item })?.bg;
                  textColor = find(typeOptions, { name: item })?.shouldTextDark
                    ? "text-slate-800"
                    : "text-slate-50";
                  return (
                    <div
                      className={`badge badge-outline ${bgColor} badge-lg ${textColor}`}
                      key={index}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <hr />
      </li>
      {/* traffic */}
      <li>
        {cardOrder !== 1 && <hr />}
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div
          className={
            cardOrder % 2 === 1 ? "timeline-start md:text-end" : "timeline-end"
          }
        >
          <time className="font-mono text-xl italic">{attractionEndTime}</time>
        </div>
      </li>
      {!isLastOne && (
        <li>
          <hr />
          <TravelModeAlert
            mode={attraction.travelMode}
            duration={attraction.routeDuration}
          />
          <hr />
        </li>
      )}
    </>
  );
};

export default TimeCard;
