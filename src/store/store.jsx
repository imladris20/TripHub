import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const TAIWAN = { lat: 23.553118, lng: 121.0211024 };

const useStore = create((set, get) => ({
  open: false,
  currentCenter: TAIWAN,
  currentZoom: 8.5,
  apiKey,
  mapId,
  selected: null,
  placeResult: null,
  isLogin: false,
  isSignWindowOpen: false,
  database: null,
  searchItemDetailInfo: null,
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
  ],
  setSearchItemDetailInfo: (place) => {
    set(
      produce((state) => {
        state.searchItemDetailInfo = place;
      }),
    );
  },
  setIsLogin: (boolean) => {
    set(
      produce((state) => {
        state.isLogin = boolean;
      }),
    );
  },
  setDatabase: (db) => {
    set(
      produce((state) => {
        state.database = db;
      }),
    );
  },
  setIsSignWindowOpen: (boolean) => {
    set(
      produce((state) => {
        state.isSignWindowOpen = boolean;
      }),
    );
  },
  setPlaceResult: (placeResult) => {
    set(
      produce((state) => {
        state.placeResult = placeResult;
      }),
    );
  },
  setSelected: (placeInfo) => {
    set(
      produce((state) => {
        state.selected = placeInfo;
      }),
    );
  },
  setMap: (newMap) => {
    set(
      produce((state) => {
        state.map = newMap;
      }),
    );
  },
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
}));

export default useStore;
