import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const TAIWAN = { lat: 23.553118, lng: 121.0211024 };

const useStore = create((set, get) => ({
  apiKey,
  mapId,
  typeOptions: [
    "自然景點",
    "人文景點",
    "室內景點",
    "山",
    "海",
    "博物館",
    "古蹟",
    "購物",
    "生活用品",
    "打卡拍照",
    "餐廳",
    "小吃",
    "伴手禮",
    "海灘",
    "租車",
    "車站",
    "咖哩",
    "拉麵",
    "慈善機構",
    "麻糬",
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
}));
