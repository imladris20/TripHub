import { arrayUnion } from "firebase/firestore";
import { produce } from "immer";
import { find, includes, indexOf } from "lodash";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import PlaceHolderPhoto from "../../assets/pois_photo_placeholder.png";
import globalStore from "../../store/store";
import { CloseIcon, PlusIcon } from "../../utils/icons";
import { db } from "../../utils/tripHubDb";

const Detail = () => {
  const {
    searchItemDetailInfo,
    setSearchItemDetailInfo,
    typeOptions,
    prepareColor,
    setTypeOptions,
  } = globalStore();
  const [categoryTags, setCategoryTags] = useState([]);
  const [newCategoryToAdd, setNewCategoryToAdd] = useState("");

  const setDocMutation = useMutation(({ docData }) => {
    db.updateDoc("addPois", docData);
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

  const city =
    address_components.find((element) =>
      element.types.includes("administrative_area_level_1"),
    )?.long_name ||
    address_components.find((element) => element.types.includes("country"))
      ?.long_name;

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
      photoLink: (photos && photos[0]?.getUrl()) || "店家未提供",
      openingHours: opening_hours?.weekday_text || "店家未提供",
      gmapUrl: url,
      archived: false,
    };

    await setDocMutation.mutateAsync({ docData });

    toast.success(`點選左方口袋清單頁面，即可看到剛加入的「${name}」唷！`, {
      duration: 2000,
      position: "top-center",
      className: "bg-slate-100",
      icon: "👈",
    });

    setTimeout(() => {
      setSearchItemDetailInfo(null);
    }, 2250);
  };

  const handleSelectChange = (e, index) => {
    setCategoryTags(
      produce((state) => {
        state[index] = e.target.value;
      }),
    );
  };

  const handleNewCategoryInput = (e) => {
    setNewCategoryToAdd(e.target.value);
  };

  const getDisplayLength = (str) => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      const charUnicode = str.charCodeAt(i);

      if (charUnicode >= 0x4e00 && charUnicode <= 0x9fff) {
        length += 2;
      } else {
        length += 1;
      }
    }
    return length;
  };

  const handleAddNewCategoryTag = async () => {
    if (newCategoryToAdd.trim().length === 0) {
      toast.error("無法加入空白標籤", {
        duration: 1500,
        position: "bottom-center",
        className: "bg-slate-100",
        icon: "😅",
      });
      setNewCategoryToAdd("");
      return;
    }

    if (getDisplayLength(newCategoryToAdd) > 10) {
      toast.error("標籤最多5個字唷", {
        duration: 1500,
        position: "bottom-center",
        className: "bg-slate-100",
        icon: "😅",
      });
      return;
    }

    if (typeOptions.length >= 40) {
      toast.error("標籤數已達上限", {
        duration: 2000,
        position: "bottom-center",
        className: "bg-slate-100",
        icon: "😔",
      });
      return;
    }

    if (find(typeOptions, { name: newCategoryToAdd })) {
      toast.error("此標籤已存在", {
        duration: 2000,
        position: "bottom-center",
        className: "bg-slate-100",
        icon: "👀",
      });
      if (categoryTags.length < 3) {
        setCategoryTags(
          produce((state) => {
            state[state.length] = newCategoryToAdd;
          }),
        );
      }
      setNewCategoryToAdd("");
      return;
    }

    const docSnap = await db.getDoc("userInfo");
    const newOption = {
      name: newCategoryToAdd,
      bg: prepareColor[docSnap?.categories?.length || 0].bg,
      shouldTextDark:
        prepareColor[docSnap?.categories?.length || 0].shouldTextDark,
    };

    setTypeOptions(newOption);

    const newDocData = {
      categories: arrayUnion(newCategoryToAdd),
    };

    await db.updateDoc("userInfo", newDocData);

    if (categoryTags.length < 3) {
      setCategoryTags(
        produce((state) => {
          state[state.length] = newCategoryToAdd;
        }),
      );
    }
    setNewCategoryToAdd("");
  };

  return (
    <div className="absolute left-[21%] top-8 z-[999] flex h-[calc(100%-32px)] w-1/4 flex-col items-start gap-3 rounded-lg border-b-2 border-solid border-gray-200 bg-white p-3 shadow-2xl 2xl:w-1/5">
      <Toaster />
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
      {!searchItemDetailInfo.isInPois && (
        <div className="mt-4 flex w-full flex-col gap-2">
          <h1 className="text-left text-base font-bold">
            為景點加上標籤再放入口袋清單吧~
          </h1>
          <div className="flex w-full flex-row items-center justify-start gap-4 px-[2px]">
            {[
              ...Array(categoryTags.length >= 3 ? 3 : categoryTags.length + 1),
            ].map((_, selectIndex) => (
              <select
                key={selectIndex}
                className="h-7 w-[84px] cursor-pointer rounded-lg bg-lime-200 p-1 text-xs text-black shadow outline-none"
                value={categoryTags[selectIndex]}
                onChange={(e) => handleSelectChange(e, selectIndex)}
              >
                <option className="bg-white text-xs text-slate-800" value="">
                  請選擇
                </option>
                {typeOptions.map((option, optionIndex) => {
                  if (
                    !includes(categoryTags, option.name) ||
                    indexOf(categoryTags, option.name) === selectIndex
                  ) {
                    return (
                      <option
                        key={optionIndex}
                        value={option.name}
                        className="bg-white text-xs text-slate-800"
                      >
                        {option.name}
                      </option>
                    );
                  }
                })}
              </select>
            ))}
          </div>
          <div className="mt-1 flex flex-row items-center justify-start">
            <h1 className="mr-1 whitespace-nowrap text-xs">或新增自訂標籤：</h1>
            <input
              type="text"
              placeholder="標籤以5個字為限"
              className="input input-bordered mr-2 h-5 w-full max-w-[176px] pl-2 text-xs"
              value={newCategoryToAdd}
              onInput={(e) => handleNewCategoryInput(e)}
            />
            <button
              className="btn btn-circle btn-xs h-4 min-h-0 w-4 border-green-500 bg-white p-0"
              onClick={handleAddNewCategoryTag}
              disabled={!newCategoryToAdd}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={`${
                  !newCategoryToAdd ? "stroke-slate-400" : "stroke-green-500"
                }`}
              >
                <PlusIcon />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="mt-auto flex w-full flex-row items-center justify-center shadow-2xl">
        {setDocMutation.isSuccess || searchItemDetailInfo.isInPois ? (
          <button className="h-10 w-full cursor-default rounded-xl bg-sky-200 p-2 font-bold text-gray-800">
            已加入口袋清單！
          </button>
        ) : (
          <button
            className="btn btn-primary h-10 w-full rounded-xl p-2 font-bold text-gray-800"
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
