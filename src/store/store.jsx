import { produce } from "immer";
import { create } from "zustand";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
const initialPosition = { lat: 25.0384859846332, lng: 121.53237060857701 };
const initialState = 0;

const useStore = create((set, get) => ({
  open: false,
  bears: initialState,
  initialPosition,
  apiKey,
  mapId,
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
