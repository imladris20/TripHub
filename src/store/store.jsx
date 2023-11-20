import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const defaultPosition = { lat: 23.553118, lng: 121.0211024 };
const awsPosition = { lat: 25.0384859846332, lng: 121.53237060857701 };
const initialState = 0;
let map;
const selected = null;

const useStore = create((set, get) => ({
  open: false,
  bears: initialState,
  currentPosition: defaultPosition,
  apiKey,
  mapId,
  map,
  selected,
  setSelected: (geolocation) => {
    set(
      produce((state) => {
        state.selected = geolocation;
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
  setCurrentPosition: (geolocation) => {
    set(
      produce((state) => {
        state.currentPosition = geolocation;
      }),
    );
  },
  increasePopulation: () => {
    set(
      produce((state) => {
        state.bears = state.bears + 1;
      }),
    );
    console.log("get", get());
  },
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => {
    set(
      produce((state) => {
        state.bears = 0;
      }),
    );
    console.log("get", get());
  },
  setOpen: (boolean) => {
    set(
      produce((state) => {
        state.open = boolean;
      }),
    );
  },
}));

export default useStore;
