import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const TAIWAN = { lat: 23.62758169093335, lng: 121.01767227950151 };
const colors = [
  { bg: "bg-sand", shouldTextDark: true },
  { bg: "bg-deyork", shouldTextDark: false },
  { bg: "bg-blueWillow", shouldTextDark: false },
  { bg: "bg-sage", shouldTextDark: false },
  { bg: "bg-flame", shouldTextDark: false },
  { bg: "bg-fawn", shouldTextDark: false },
  { bg: "bg-tundra", shouldTextDark: false },
  { bg: "bg-glacierBlue", shouldTextDark: false },
  { bg: "bg-cider", shouldTextDark: false },
  { bg: "bg-myslate", shouldTextDark: false },
  { bg: "bg-oxford", shouldTextDark: false },
  { bg: "bg-chinchilla", shouldTextDark: false },
  { bg: "bg-grape", shouldTextDark: true },
  { bg: "bg-havelock", shouldTextDark: false },
  { bg: "bg-tawny", shouldTextDark: false },
  { bg: "bg-moss", shouldTextDark: false },
  { bg: "bg-lipstick", shouldTextDark: true },
  { bg: "bg-ballet", shouldTextDark: true },
  { bg: "bg-opium", shouldTextDark: false },
  { bg: "bg-steelBlue", shouldTextDark: false },
  { bg: "bg-rust", shouldTextDark: false },
  { bg: "bg-fruitSalad", shouldTextDark: true },
  { bg: "bg-labrodorite", shouldTextDark: false },
  { bg: "bg-apricot", shouldTextDark: true },
  { bg: "bg-smoke", shouldTextDark: false },
  { bg: "bg-thistle", shouldTextDark: false },
  { bg: "bg-monarch", shouldTextDark: true },
  { bg: "bg-olivine", shouldTextDark: true },
  { bg: "bg-casablanca", shouldTextDark: true },
  { bg: "bg-shrimp", shouldTextDark: true },
  { bg: "bg-yam", shouldTextDark: false },
  { bg: "bg-copper", shouldTextDark: false },
  { bg: "bg-tabasco", shouldTextDark: false },
  { bg: "bg-brandy", shouldTextDark: true },
  { bg: "bg-peach", shouldTextDark: true },
  { bg: "bg-azalea", shouldTextDark: true },
  { bg: "bg-pacific", shouldTextDark: false },
  { bg: "bg-keppel", shouldTextDark: true },
  { bg: "bg-lavender", shouldTextDark: true },
  { bg: "bg-seafoam", shouldTextDark: true },
  { bg: "bg-carrot", shouldTextDark: true },
];

const useStore = create((set, get) => ({
  apiKey,
  mapId,
  prepareColor: colors,
  typeOptions: [
    { name: "自然景點", bg: "bg-fruitSalad", shouldTextDark: false },
    { name: "人文景點", bg: "bg-[#A67F78]", shouldTextDark: false },
    { name: "打卡拍照", bg: "bg-[#FE7773]", shouldTextDark: false },
    { name: "餐廳", bg: "bg-[#B78338]", shouldTextDark: false },
    { name: "小吃", bg: "bg-[#40686A]", shouldTextDark: false },
    { name: "購物", bg: "bg-[#689C97]", shouldTextDark: false },
    { name: "飯店", bg: "bg-carrot", shouldTextDark: true },
    { name: "青旅", bg: "bg-seafoam", shouldTextDark: false },
    { name: "民宿", bg: "bg-lavender", shouldTextDark: false },
    { name: "博物館", bg: "bg-[#BD8E62]", shouldTextDark: false },
    { name: "紀念品店", bg: "bg-blueWillow", shouldTextDark: false },
    { name: "伴手禮", bg: "bg-[#BC5F6A]", shouldTextDark: false },
    { name: "古蹟", bg: "bg-[#915C4C]", shouldTextDark: false },
    { name: "租車", bg: "bg-[#003E19]", shouldTextDark: false },
    { name: "搭車地", bg: "bg-[#69491A]", shouldTextDark: false },
    { name: "咖哩", bg: "bg-[#F2AB39]", shouldTextDark: true },
    { name: "拉麵", bg: "bg-[#8F8681]", shouldTextDark: false },
    { name: "麻糬", bg: "bg-[#A46843]", shouldTextDark: false },
    { name: "山", bg: "bg-[#028C6A]", shouldTextDark: false },
    { name: "海", bg: "bg-[#85B8CB]", shouldTextDark: true },
    { name: "咖啡廳", bg: "bg-pacific", shouldTextDark: false },
    { name: "甜點店", bg: "bg-lipstick", shouldTextDark: false },
    { name: "娛樂放鬆", bg: "bg-flame", shouldTextDark: false },
  ],
  setTypeOptions: (option) => {
    set(
      produce((state) => {
        state.typeOptions.push(option);
      }),
    );
  },
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
  currentZoom: 7.65,
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
