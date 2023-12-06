import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const TAIWAN = { lat: 23.553118, lng: 121.0211024 };

const useStore = create((set, get) => ({
  apiKey,
  mapId,
  typeOptions: [
    { name: "自然景點", bg: "bg-[#7BC5AE]" },
    { name: "人文景點", bg: "bg-[#A67F78]" },
    { name: "打卡拍照", bg: "bg-[#FE7773]" },
    { name: "博物館", bg: "bg-[#BD8E62]" },
    { name: "伴手禮", bg: "bg-[#BC5F6A]" },
    { name: "古蹟", bg: "bg-[#915C4C]" },
    { name: "購物", bg: "bg-[#689C97]" },
    { name: "餐廳", bg: "bg-[#B78338]" },
    { name: "小吃", bg: "bg-[#40686A]" },
    { name: "租車", bg: "bg-[#003E19]" },
    { name: "車站", bg: "bg-[#69491A]" },
    { name: "咖哩", bg: "bg-[#F2AB39]" },
    { name: "拉麵", bg: "bg-[#8F8681]" },
    { name: "麻糬", bg: "bg-[#A46843]" },
    { name: "山", bg: "bg-[#028C6A]" },
    { name: "海", bg: "bg-[#85B8CB]" },
  ],
  taiwanCities: [
    "基隆市",
    "台北市",
    "新北市",
    "桃園市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "台中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "嘉義市",
    "台南市",
    "高雄市",
    "屏東縣",
    "台東縣",
    "花蓮縣",
    "宜蘭縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ],
  currentCenter: TAIWAN,
  currentZoom: 8.5,
  setCurrentCenter: (geolocation) => {
    set(
      produce((state) => {
        state.currentCenter = geolocation;
      }),
    );
  },
  setCurrentZoom: (level) => {
    set(
      produce((state) => {
        state.currentZoom = level;
      }),
    );
  },
  selected: null,
  setSelected: (placeInfo) => {
    set(
      produce((state) => {
        state.selected = placeInfo;
      }),
    );
  },
  placeResult: null,
  setPlaceResult: (placeResult) => {
    set(
      produce((state) => {
        state.placeResult = placeResult;
      }),
    );
  },
  isLogin: false,
  setIsLogin: (boolean) => {
    set(
      produce((state) => {
        state.isLogin = boolean;
      }),
    );
  },
  isSignWindowOpen: false,
  setIsSignWindowOpen: (boolean) => {
    set(
      produce((state) => {
        state.isSignWindowOpen = boolean;
      }),
    );
  },
  database: null,
  setDatabase: (db) => {
    set(
      produce((state) => {
        state.database = db;
      }),
    );
  },
  searchItemDetailInfo: null,
  setSearchItemDetailInfo: (place) => {
    set(
      produce((state) => {
        state.searchItemDetailInfo = place;
      }),
    );
  },
  username: localStorage.getItem("username"),
  setUsername: (name) => {
    set(
      produce((state) => {
        state.username = name;
      }),
    );
  },
}));

export default useStore;

export const poisStore = create((set, get) => ({
  currentCenter: TAIWAN,
  currentZoom: 7.5,
  setCurrentCenter: (geolocation) => {
    set(
      produce((state) => {
        state.currentCenter = geolocation;
      }),
    );
  },
  setCurrentZoom: (level) => {
    set(
      produce((state) => {
        state.currentZoom = level;
      }),
    );
  },
  poisItemDetailInfo: null,
  setPoisItemDetailInfo: (place) => {
    set(
      produce((state) => {
        state.poisItemDetailInfo = place;
      }),
    );
  },
  currentPois: null,
  setCurrentPois: (poisArr) => {
    set(
      produce((state) => {
        state.currentPois = poisArr;
      }),
    );
  },
  isFilterWindowOpen: false,
  setIsFilterWindowOpen: () => {
    set(
      produce((state) => {
        state.isFilterWindowOpen = !state.isFilterWindowOpen;
      }),
    );
  },
  selectedCity: "",
  setSelectedCity: (poisArr) => {
    set(
      produce((state) => {
        state.selectedCity = poisArr;
      }),
    );
  },
}));

export const scheduleStore = create((set, get) => ({
  currentCenter: TAIWAN,
  currentZoom: 7.5,
  setCurrentCenter: (geolocation) => {
    set(
      produce((state) => {
        state.currentCenter = geolocation;
      }),
    );
  },
  setCurrentZoom: (level) => {
    set(
      produce((state) => {
        state.currentZoom = level;
      }),
    );
  },
  isTripSelected: false,
  setIsTripSelected: (bool) => {
    set(
      produce((state) => {
        state.isTripSelected = bool;
      }),
    );
  },
  currentLoadingTripId: null,
  setCurrentLoadingTripId: (tripId) => {
    set(
      produce((state) => {
        state.currentLoadingTripId = tripId;
      }),
    );
  },
  currentLoadingTripData: null,
  setCurrentLoadingTripData: (docSnapData) => {
    set(
      produce((state) => {
        state.currentLoadingTripData = docSnapData;
      }),
    );
  },
  tripSelectModal: null,
  setTripSelectModal: (ref) => {
    set(
      produce((state) => {
        state.tripSelectModal = ref;
      }),
    );
  },
  attractionItemDetail: null,
  setAttractionItemDetail: (place) => {
    set(
      produce((state) => {
        state.attractionItemDetail = place;
      }),
    );
  },
  currentTripDuration: 0,
  setCurrentTripDuration: (num) => {
    set(
      produce((state) => {
        state.currentTripDuration = num;
      }),
    );
  },
  attractionsData: [],
  setAttractionsData: (result) => {
    set(
      produce((state) => {
        state.attractionsData = result;
      }),
    );
  },
}));
