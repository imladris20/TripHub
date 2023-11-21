import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const awsPosition = { lat: 25.0384859846332, lng: 121.53237060857701 };

const useStore = create((set, get) => ({
  open: false,
  currentCenter: { lat: 23.553118, lng: 121.0211024 },
  currentZoom: 8.5,
  apiKey,
  mapId,
  selected: null,
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
